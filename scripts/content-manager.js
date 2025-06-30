// Content management with template processing
class ContentManager {
    constructor() {
        this.contentCache = new Map();
    }
    
    async loadLetterContent(letterId) {
        if (this.contentCache.has(letterId)) {
            return this.contentCache.get(letterId);
        }
        
        try {
            // Load the actual JSON file
            const response = await fetch('data/vellynne-letter.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const letterData = await response.json();
            
            const processedContent = {
                metadata: letterData.metadata,
                content: letterData.content
            };
            
            this.contentCache.set(letterId, processedContent);
            return processedContent;
            
        } catch (error) {
            console.error(`Failed to load letter: ${letterId}`, error);
            
            // Return fallback content if JSON fails to load
            return this.getFallbackContent();
        }
    }
    
    getFallbackContent() {
        return {
            metadata: {
                sender: {
                    title: "Correspondence from Vellynne Harpell",
                    subtitle: "Tenth Black Staff of Blackstaff Academy"
                },
                recipient: "Rothbart",
                date: {
                    datetime: "1489",
                    display: "1489 DR, Hammer (Second Tenday)"
                },
                deliveryMethod: "Delivered by snowy owl familiar"
            },
            content: {
                greeting: "Dear Rothbart,",
                paragraphs: [
                    {
                        id: "1",
                        type: "body",
                        text: "I trust this missive finds you well-rested after your eventful journey. Word travels quickly through the Ten Towns, and your party's heroic efforts have not gone unnoticed."
                    },
                    {
                        id: "2",
                        type: "body", 
                        text: "The magical theorist in me is absolutely fascinated by your recent acquisitions. Such artifacts represent sophisticated enchantment work from ages past."
                    }
                ],
                closing: "With anticipation of our collaboration,",
                signature: {
                    name: "Vellynne Harpell",
                    title: "Tenth Black Staff of Blackstaff Academy"
                },
                postscript: "I look forward to our continued adventures together."
            }
        };
    }
}

export { ContentManager };
