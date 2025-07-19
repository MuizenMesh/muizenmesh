// Force particles div to full screen
window.addEventListener('load', function() {
    const particlesDiv = document.getElementById('particles-js');
    if (particlesDiv) {
        console.log('Forcing particles div to full screen...');
        console.log('Screen height:', window.innerHeight);
        console.log('Screen width:', window.innerWidth);
        
        // Force with pixel values
        particlesDiv.style.position = 'fixed';
        particlesDiv.style.top = '0px';
        particlesDiv.style.left = '0px';
        particlesDiv.style.width = window.innerWidth + 'px';
        particlesDiv.style.height = window.innerHeight + 'px';
        particlesDiv.style.zIndex = '999';
        particlesDiv.style.pointerEvents = 'none';
        particlesDiv.style.maxHeight = 'none';
        particlesDiv.style.maxWidth = 'none';
        
        // Check parent constraints
        let parent = particlesDiv.parentElement;
        console.log('Parent element:', parent.tagName, parent.className);
        console.log('Parent height:', window.getComputedStyle(parent).height);
        
        setTimeout(() => {
            const styles = window.getComputedStyle(particlesDiv);
            console.log('After forcing - height:', styles.height);
            console.log('After forcing - width:', styles.width);
            
            // Force particles.js to resize
            if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
                console.log('Forcing particles.js resize...');
                window.pJSDom[0].pJS.fn.canvasSize();
            }
        }, 500);
    }
});