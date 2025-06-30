// Component-based rendering system
class ComponentRenderer {
    constructor() {
        this.components = new Map();
        this.registerDefaultComponents();
    }
    
    registerDefaultComponents() {
        this.components.set('letter-header', new LetterHeaderComponent());
        this.components.set('letter-body', new LetterBodyComponent());
        this.components.set('letter-footer', new LetterFooterComponent());
    }
    
    renderLetter(container, letterData) {
        const letterElement = this.createLetterElement();
        
        // Render header
        const header = this.renderComponent('letter-header', letterData.metadata);
        letterElement.appendChild(header);
        
        // Render body
        const body = this.renderComponent('letter-body', letterData.paragraphs);
        letterElement.appendChild(body);
        
        // Render footer
        const footer = this.renderComponent('letter-footer', letterData.metadata);
        letterElement.appendChild(footer);
        
        container.appendChild(letterElement);
        
        return letterElement;
    }
    
    renderComponent(componentName, data) {
        const component = this.components.get(componentName);
        if (!component) {
            throw new Error(`Component not found: ${componentName}`);
        }
        
        return component.render(data);
    }
    
    createLetterElement() {
        const article = document.createElement('article');
        article.className = 'vellynne-letter';
        article.setAttribute('itemscope', '');
        article.setAttribute('itemtype', 'http://schema.org/Letter');
        return article;
    }
}

// Individual component classes
class LetterHeaderComponent {
    render(metadata) {
        const header = document.createElement('header');
        header.className = 'letter-header';
        header.innerHTML = this.generateHeaderHTML(metadata);
        return header;
    }
    
    generateHeaderHTML(metadata) {
        return `
            <div class="sender-info">
                <h1 class="sender-title" itemprop="sender">${metadata.sender.title}</h1>
                <h2 class="sender-subtitle">${metadata.sender.subtitle}</h2>
            </div>
            <div class="letter-metadata">
                <time class="letter-date" datetime="${metadata.date.datetime}" itemprop="dateCreated">
                    ${metadata.date.display}
                </time>
                <div class="recipient-info">
                    <span class="recipient-label">To:</span>
                    <span class="recipient-name" itemprop="recipient">${metadata.recipient}</span>
                </div>
                <div class="delivery-method" itemprop="deliveryMethod">
                    <em>${metadata.deliveryMethod}</em>
                </div>
            </div>
        `;
    }
}

class LetterBodyComponent {
    render(paragraphs) {
        const section = document.createElement('section');
        section.className = 'letter-body';
        section.setAttribute('itemprop', 'text');
        
        paragraphs.forEach(paragraph => {
            const paragraphElement = this.createParagraphElement(paragraph);
            section.appendChild(paragraphElement);
        });
        
        return section;
    }
    
    createParagraphElement(paragraph) {
        const div = document.createElement('div');
        div.className = `letter-${paragraph.type}`;
        div.setAttribute('data-paragraph', paragraph.id);
        
        const p = document.createElement('p');
        p.innerHTML = paragraph.text;
        div.appendChild(p);
        
        return div;
    }
}

export { ComponentRenderer };
