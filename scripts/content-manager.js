// Content management with template processing
class ContentManager {
    constructor() {
        this.templates = new Map();
        this.contentCache = new Map();
    }
    
    async loadLetterContent(letterId) {
        if (this.contentCache.has(letterId)) {
            return this.contentCache.get(letterId);
        }
        
        try {
            const response = await fetch(`data/letters/${letterId}.json`);
            const letterData = await response.json();
            
            const processedContent = this.processContentTemplate(letterData);
            this.contentCache.set(letterId, processedContent);
            
            return processedContent;
        } catch (error) {
            throw new Error(`Failed to load letter: ${letterId}`);
        }
    }
    
    processContentTemplate(letterData) {
        // Template processing logic
        return {
            metadata: this.extractMetadata(letterData),
            paragraphs: this.processParagraphs(letterData.content),
            interactiveElements: this.identifyInteractiveElements(letterData)
        };
    }
    
    extractMetadata(data) {
        return {
            sender: data.sender,
            recipient: data.recipient,
            date: data.date,
            deliveryMethod: data.delivery_method
        };
    }
    
    processParagraphs(content) {
        return content.paragraphs.map(paragraph => ({
            id: paragraph.id,
            text: this.processInlineReferences(paragraph.text),
            type: paragraph.type || 'body'
        }));
    }
    
    processInlineReferences(text) {
        // Replace character references with interactive spans
        return text.replace(
            /\{character:(\w+)\}/g, 
            (match, characterId) => {
                const character = CampaignData.getCharacter(characterId);
                return character ? 
                    `<span class="character-ref" data-character="${characterId}">${character.name}</span>` :
                    match;
            }
        );
    }
    
    identifyInteractiveElements(data) {
        const elements = [];
        
        // Scan for references that need tooltips
        data.content.paragraphs.forEach(paragraph => {
            const characterRefs = this.extractReferences(paragraph.text, 'character');
            const locationRefs = this.extractReferences(paragraph.text, 'location');
            
            elements.push(...characterRefs, ...locationRefs);
        });
        
        return elements;
    }
}

export { ContentManager };
