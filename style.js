// Drag and drop functionality
const components = document.querySelectorAll('.component');
const canvas = document.getElementById('canvas');

components.forEach(component => {
    component.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', e.target.dataset.type);
    });
});

canvas.addEventListener('dragover', (e) => {
    e.preventDefault();
});

canvas.addEventListener('drop', (e) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData('text/plain');
    addComponentToCanvas(componentType);
});

function addComponentToCanvas(type) {
    const component = createComponent(type);
    canvas.appendChild(component);
    updatePreview();
}

function createComponent(type) {
    const div = document.createElement('div');
    div.className = 'canvas-component';
    div.innerHTML = getComponentHTML(type);
    return div;
}

function getComponentHTML(type) {
    const components = {
        hero: `<div class="hero-section"><h3>Business Name</h3><p>Your business tagline</p></div>`,
        contact: `<div class="contact-form"><h4>Contact Us</h4><input placeholder="Name"><button>Send</button></div>`,
        products: `<div class="product-grid"><h4>Our Products</h4><div class="products">Product 1 | Product 2</div></div>`,
        gallery: `<div class="gallery"><h4>Gallery</h4><div>Image 1 | Image 2</div></div>`
    };
    return components[type] || '<div>Component</div>';
}

function updatePreview() {
    document.getElementById('preview-content').innerHTML = canvas.innerHTML;
}

function exportWebsite() {
    const websiteHTML = canvas.innerHTML;
    alert('Website exported! Ready for backend integration.');
    console.log('Website JSON:', { components: websiteHTML });
}