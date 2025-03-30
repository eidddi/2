// Add to your script.js
document.querySelector('.copy-button').addEventListener('click', function() {
    const phoneNumber = '01774994794';
    
    navigator.clipboard.writeText(phoneNumber).then(() => {
        // Change button text temporarily
        const originalText = this.textContent;
        this.textContent = 'copied!';
        
        setTimeout(() => {
            this.textContent = originalText;
        }, 2000);
        
    }).catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy number');
    });
});