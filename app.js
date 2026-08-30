/**
 * DATA ADAPTER (LocalStorage by default)
 * Replace methods with standard fetch() endpoints when attaching an external backend.
 */
const StorageAdapter = {
  STORAGE_KEY: "app_blog_posts",

  getInitialPost() {
  return {
    id: "post-1",
    title: "The Shift from Bigger Models to Smarter Inference",
    date: "August 30, 2026",
    readTime: "3 min read",
    image: "image/images.jpg",
    content: "For the past few years, the standard formula for better AI was simple: train larger models on more data. While this approach delivered massive gains, it is quickly hitting practical limits in power consumption, memory bandwidth, and data availability.\n\nThe industry focus is now shifting from how models are trained to how they run during inference.\n\nInstead of answering instantly with a single forward pass, modern reasoning models spend extra compute time \"thinking\" before returning a final answer. By breaking down complex problems into smaller intermediate steps, validating logic paths, and correcting early mistakes, a smaller model can often outperform a system ten times its size.\n\nThis shift changes what matters in systems engineering:\n\n- Compute on Demand: Instead of a fixed cost per token, compute is dynamically allocated based on how difficult the prompt is.\n- Efficiency Over Raw Size: Optimizing inference serving, memory caching, and token generation speed now yields better results than simply adding more parameters.\n- Verified Reasoning: Outputs are checked iteratively rather than assumed correct on the first attempt.\n\nThe next generation of software won't just run bigger weights; it will manage how and when models spend their compute budget to solve hard problems."
  };
},

  async getAllPosts() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) {
      const seed = [this.getInitialPost()];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  },

  async savePost(post) {
    const posts = await this.getAllPosts();
    posts.unshift(post);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(posts));
    return post;
  },

  async deletePost(id) {
    let posts = await this.getAllPosts();
    posts = posts.filter(p => p.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(posts));
    return true;
  }
};

/**
 * UTILITIES
 */
const Utils = {
  calculateReadTime(text) {
    const wpm = 200;
    const words = text.trim().split(/\s+/).length;
    return `${Math.ceil(words / wpm)} min read`;
  },

  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
};

/**
 * PAGE CONTROLLERS
 */
async function initPublicFeed() {
  const feed = document.getElementById("feed");
  if (!feed) return;

  const posts = await StorageAdapter.getAllPosts();
  feed.innerHTML = "";

  if (posts.length === 0) {
    feed.innerHTML = `
      <div class="empty-state">
        <p>No articles published yet.</p>
        <p style="margin-top: 0.5rem;"><a href="admin.html" style="color: var(--primary);">Go to Admin Dashboard</a> to write your first entry.</p>
      </div>
    `;
    return;
  }

  posts.forEach(post => {
    const card = document.createElement("article");
    card.className = "article-card";
    
    const imgElement = post.image 
      ? `<div class="article-cover-wrap"><img src="${post.image}" alt="${post.title}" class="article-cover" loading="lazy"></div>` 
      : "";

    card.innerHTML = `
      ${imgElement}
      <div class="article-inner">
        <div class="article-meta">
          <span>${post.date}</span>
          <span class="separator">•</span>
          <span>${post.readTime}</span>
        </div>
        <h2 class="article-title">${post.title}</h2>
        <div class="article-prose">${post.content}</div>
      </div>
    `;
    feed.appendChild(card);
  });
}

async function initAdminPanel() {
  const form = document.getElementById("post-form");
  const tbody = document.getElementById("posts-table-body");
  if (!form || !tbody) return;

  async function renderTable() {
    const posts = await StorageAdapter.getAllPosts();
    tbody.innerHTML = "";

    if (posts.length === 0) {
      tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-dim); padding: 2rem;">No articles found in storage.</td></tr>`;
      return;
    }

    posts.forEach(post => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${post.title}</strong></td>
        <td>${post.date}</td>
        <td style="text-align: right;">
          <button class="btn-action-delete" data-id="${post.id}">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll(".btn-action-delete").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        await StorageAdapter.deletePost(id);
        renderTable();
      });
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();
    const imageFile = document.getElementById("image").files[0];

    const imageBase64 = await Utils.fileToBase64(imageFile);
    const dateFormatted = new Date().toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric"
    });

    const newPost = {
      id: "post-" + Date.now(),
      title,
      date: dateFormatted,
      readTime: Utils.calculateReadTime(content),
      image: imageBase64,
      content
    };

    await StorageAdapter.savePost(newPost);
    form.reset();
    renderTable();
  });

  renderTable();
}

document.addEventListener("DOMContentLoaded", () => {
  initPublicFeed();
  initAdminPanel();
});