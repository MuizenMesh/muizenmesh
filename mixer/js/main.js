            // Starting Akko and adding multiple visualisers
            var akko = new Akko({
                autoPlay: true,
                useDefaultVisualisers: false,
            });
            
            // Add all our custom visualizers with error handling
            try {
                console.log('Adding CustomVisualiser...');
                akko.addVisualiser(new CustomVisualiser());
                console.log('✅ CustomVisualiser added');
            } catch (e) {
                console.error('❌ CustomVisualiser failed:', e);
            }
            
            try {
                console.log('Adding WaveVisualiser...');
                var waveVis = new WaveVisualiser();
                console.log('WaveVisualiser created:', waveVis);
                akko.addVisualiser(waveVis);
                console.log('✅ WaveVisualiser added');
            } catch (e) {
                console.error('❌ WaveVisualiser failed:', e);
            }
            
            try {
                console.log('Adding SphereVisualiser...');
                akko.addVisualiser(new SphereVisualiser());
                console.log('✅ SphereVisualiser added');
            } catch (e) {
                console.error('❌ SphereVisualiser failed:', e);
            }
            
            try {
                console.log('Adding BarsVisualiser...');
                var barsVis = new BarsVisualiser();
                console.log('BarsVisualiser created:', barsVis);
                akko.addVisualiser(new CustomBarsVisualiser());
                console.log('✅ BarsVisualiser added');
            } catch (e) {
                console.error('❌ BarsVisualiser failed:', e);
            }
            
            // Check what visualizers are available
            setTimeout(function() {
                console.log('Available visualizers after 2 seconds:');
                console.log('Akko object keys:', Object.keys(akko));
                
                // Try different property names
                var visualizers = akko.visualisers || akko.visualizers || akko._visualisers || akko._visualizers;
                if (visualizers) {
                    console.log('Visualizer count:', visualizers.length);
                    visualizers.forEach(function(vis, index) {
                        console.log(index + ':', vis.name || vis.constructor.name, vis.code);
                    });
                } else {
                    console.log('No visualizers found. Trying to inspect akko object...');
                    // Check visCore for visualizers
                    if (akko.visCore && akko.visCore.visualisers) {
                        console.log('Found visualizers in visCore:', akko.visCore.visualisers.length);
                        akko.visCore.visualisers.forEach(function(vis, index) {
                            console.log(index + ':', vis.name, vis.code, 'initialized:', vis.initialised);
                        });
                    }
                    
                    for (var prop in akko) {
                        if (Array.isArray(akko[prop]) && akko[prop].length > 0) {
                            console.log('Found array property:', prop, 'with', akko[prop].length, 'items');
                        }
                    }
                }
            }, 2000);
            akko.addTrack('/mixer/audio/Fatal Force - Fan Girls.mp3');
            akko.addTrack('/mixer/audio/Computer Music All-Stars - Albatross v2.mp3');
            akko.start();