class WebsiteBuilder {
  constructor() {
    this.builder = document.getElementById("builder");
    this.blocks = [];

    // Buttons
    document.getElementById("addText").onclick = () => this.addText();
    document.getElementById("addImage").onclick = () => this.addImage();
    document.getElementById("aiContent").onclick = () => this.askAI("content");
    document.getElementById("aiImage").onclick = () => this.askAI("image");
    document.getElementById("publishSite").onclick = () => this.publish();
  }

  addText() {
    const text = prompt("Enter text:");
    if (text) {
      this.blocks.push({ type: "text", content: text });
      this.render();
    }
  }

  addImage() {
    const url = prompt("Enter image URL:");
    if (url) {
      this.blocks.push({ type: "image", url });
      this.render();
    }
  }

  async askAI(task) {
    const instructions = prompt("Enter instructions for AI:");
    if (!instructions) return;

    const res = await fetch("/generateContent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task, instructions })
    });

    const data = await res.json();
    if (task === "image") {
      this.blocks.push({ type: "image", url: data.image_url });
    } else {
      this.blocks.push({ type: "text", content: data.content });
    }
    this.render();
  }

  async publish() {
    const siteData = {
      title: "My Local Business",
      blocks: this.blocks
    };

    const res = await fetch("/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(siteData)
    });

    const data = await res.json();
    document.getElementById("publishInfo").innerHTML =
      `<p>✅ Published: <a href="${data.site_url}" target="_blank">${data.site_url}</a></p>
       <img src="${data.qr_code}" class="mt-2 w-32"/>`;
  }

  render() {
    this.builder.innerHTML = "";
    this.blocks.forEach(block => {
      if (block.type === "text") {
        this.builder.innerHTML += `<p class="p-2 border rounded">${block.content}</p>`;
      } else if (block.type === "image") {
        this.builder.innerHTML += `<img src="${block.url}" class="p-2 border rounded w-40"/>`;
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => new WebsiteBuilder());
