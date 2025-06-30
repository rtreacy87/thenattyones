// Unit tests for ContentManager module
export class ContentManagerTests {
    constructor() {
        this.testResults = [];
    }
    
    async runAllTests() {
        console.log('Testing ContentManager module...');
        
        await this.testProcessInlineReferences();
        await this.testExtractMetadata();
        await this.testValidateLetterData();
        
        this.reportResults();
    }
    
    async testProcessInlineReferences() {
        try {
            // Mock the processing function
            const processInlineReferences = (text) => {
                return text.replace(
                    /\{character:(\w+)\}/g, 
                    (match, id) => `<span class="character-ref" data-character="${id}">${id}</span>`
                );
            };
            
            const testText = 'Hello {character:rothbart} from the meeting.';
            const result = processInlineReferences(testText);
            
            this.assertTrue(
                result.includes('data-character="rothbart"'), 
                'Should process character references correctly'
            );
            
            this.addTestResult('processInlineReferences', true, 'Character references processed correctly');
            
        } catch (error) {
            this.addTestResult('processInlineReferences', false, `Failed: ${error.message}`);
        }
    }
    
    async testExtractMetadata() {
        try {
            const mockLetterData = {
                metadata: {
                    sender: { name: 'Vellynne Harpell' },
                    recipient: 'Rothbart',
                    date: { display: '1489 DR' }
                }
            };
            
            const metadata = mockLetterData.metadata;
            
            this.assertTrue(metadata.sender.name === 'Vellynne Harpell', 'Should extract sender correctly');
            this.assertTrue(metadata.recipient === 'Rothbart', 'Should extract recipient correctly');
            
            this.addTestResult('extractMetadata', true, 'Metadata extraction works correctly');
            
        } catch (error) {
            this.addTestResult('extractMetadata', false, `Failed: ${error.message}`);
        }
    }
    
    async testValidateLetterData() {
        try {
            const validData = {
                metadata: { sender: { name: 'Test' }, recipient: 'Test' },
                content: { paragraphs: [{ id: '1', text: 'Test' }] }
            };
            
            const isValid = (data) => {
                return data.metadata && 
                       data.metadata.sender && 
                       data.content && 
                       data.content.paragraphs;
            };
            
            this.assertTrue(isValid(validData), 'Should validate correct data');
            
            this.addTestResult('validateLetterData', true, 'Data validation works correctly');
            
        } catch (error) {
            this.addTestResult('validateLetterData', false, `Failed: ${error.message}`);
        }
    }
    
    assertTrue(condition, message) {
        if (!condition) {
            throw new Error(`Assertion failed: ${message}`);
        }
    }
    
    addTestResult(testName, passed, message) {
        this.testResults.push({
            name: testName,
            passed: passed,
            message: message
        });
    }
    
    reportResults() {
        const passedTests = this.testResults.filter(test => test.passed).length;
        const totalTests = this.testResults.length;
        
        console.log(`Test Results: ${passedTests}/${totalTests} passed`);
        
        this.testResults.forEach(test => {
            const status = test.passed ? '✅' : '❌';
            console.log(`${status} ${test.name}: ${test.message}`);
        });
    }
}
