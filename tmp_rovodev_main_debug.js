// Debug script to inject into main page
window.addEventListener('load', function() {
console.log('=== PARTICLES DEBUG ===');
console.log('1. Window fully loaded');
console.log('2. particlesJS available:', typeof particlesJS);
console.log('3. particles-js div exists:', !!document.getElementById('particles-js'));
console.log('3b. All divs with particles in id:', document.querySelectorAll('[id*="particles"]'));
console.log('3c. Body innerHTML contains particles-js:', document.body.innerHTML.includes('particles-js'));

const particlesDiv = document.getElementById('particles-js');
if (particlesDiv) {
    console.log('4. particles-js div styles:');
    const styles = window.getComputedStyle(particlesDiv);
    console.log('   position:', styles.position);
    console.log('   z-index:', styles.zIndex);
    console.log('   width:', styles.width);
    console.log('   height:', styles.height);
    console.log('   display:', styles.display);
    console.log('   visibility:', styles.visibility);
    console.log('   opacity:', styles.opacity);
}

// Check if particles script is running
setTimeout(() => {
    console.log('5. After 2 seconds:');
    console.log('   pJSDom exists:', !!window.pJSDom);
    console.log('   Canvas in particles div:', !!document.querySelector('#particles-js canvas'));
    
    const canvas = document.querySelector('#particles-js canvas');
    if (canvas) {
        console.log('   Canvas size:', canvas.width, 'x', canvas.height);
        console.log('   Canvas style:', window.getComputedStyle(canvas).display);
    }
}, 2000);
});