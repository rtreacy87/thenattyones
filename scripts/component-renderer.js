// Component-based rendering system
class ComponentRenderer {
    constructor() {
        this.components = new Map();
        this.registerDefaultComponents();
    }
    
    registerDefaultComponents() {
        // Register inline component definitions (no separate files needed)
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
        const body = this.renderComponent('letter-body', letterData.content);
        letterElement.appendChild(body);
        
        // Render footer (if needed)
        const footer = this.renderComponent('letter-footer', letterData.metadata);
        letterElement.appendChild(footer);
        
        // Clear container and add letter
        container.innerHTML = '';
        container.appendChild(letterElement);
        
        return letterElement;
    }
    
    renderComponent(componentName, data) {
        const component = this.components.get(componentName);
        if (!component) {
            console.warn(`Component not found: ${componentName}`);
            return document.createElement('div');
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

// Component class definitions (included in same file for simplicity)
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
    render(content) {
        const section = document.createElement('section');
        section.className = 'letter-body';
        section.setAttribute('itemprop', 'text');
        
        // Add greeting
        if (content.greeting) {
            const greeting = document.createElement('div');
            greeting.className = 'letter-greeting';
            greeting.innerHTML = `<p>${content.greeting}</p>`;
            section.appendChild(greeting);
        }
        
        // Add paragraphs
        if (content.paragraphs) {
            content.paragraphs.forEach(paragraph => {
                const paragraphElement = this.createParagraphElement(paragraph);
                section.appendChild(paragraphElement);
            });
        }
        
        // Add closing
        if (content.closing) {
            const closing = document.createElement('div');
            closing.className = 'letter-closing';
            closing.innerHTML = `<p>${content.closing}</p>`;
            section.appendChild(closing);
        }
        
        // Add signature
        if (content.signature) {
            const signature = document.createElement('div');
            signature.className = 'letter-signature';
            signature.innerHTML = `
                <p class="signature-name">${content.signature.name}</p>
                <p class="signature-title">${content.signature.title}</p>
            `;
            section.appendChild(signature);
        }
        
        // Add postscript
        if (content.postscript) {
            const postscript = document.createElement('div');
            postscript.className = 'letter-postscript';
            postscript.innerHTML = `<p><strong>P.S.</strong> ${content.postscript}</p>`;
            section.appendChild(postscript);
        }
        
        return section;
    }
    
    createParagraphElement(paragraph) {
        const div = document.createElement('div');
        div.className = `letter-${paragraph.type}`;
        div.setAttribute('data-paragraph', paragraph.id);
        
        const p = document.createElement('p');
        p.innerHTML = this.processText(paragraph.text);
        div.appendChild(p);
        
        return div;
    }
    
    processText(text) {
        // Process character references
        text = text.replace(/\{character:(\w+)\}/g, 
            '<span class="character-ref" data-character="$1">$1</span>');
        
        // Process location references
        text = text.replace(/\{location:(\w+)\}/g, 
            '<span class="location-ref" data-location="$1">$1</span>');
        
        // Process item references
        text = text.replace(/\{item:(\w+)\}/g, 
            '<span class="item-ref" data-item="$1">$1</span>');
        
        // Process event references
        text = text.replace(/\{event:(\w+)\}/g, 
            '<span class="event-ref" data-event="$1">$1</span>');
        
        return text;
    }
}

class LetterFooterComponent {
    render(metadata) {
        const footer = document.createElement('footer');
        footer.className = 'letter-footer';
        footer.innerHTML = `
            <div class="campaign-attribution">
                <p><em>From the Icewind Dale Campaign Archives</em></p>
                <p><small>Session 2 Correspondence | ${metadata.date.display}</small></p>
            </div>
        `;
        return footer;
    }
}

export { ComponentRenderer };
