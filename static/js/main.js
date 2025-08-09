document.addEventListener("DOMContentLoaded", function() {
    // DOM Elements
    const dropZone = document.querySelector(".drop-zone");
    const fileInput = document.querySelector(".drop-zone-input");
    const previewImage = document.querySelector("#preview-image");
    const previewOverlay = document.querySelector(".preview-overlay");
    const uploadForm = document.querySelector("#upload-form");
    const resultContainer = document.querySelector("#result-container");
    const breedResult = document.querySelector("#breed-result");
    const confidenceResult = document.querySelector("#confidence-result");
    const confidenceBar = document.querySelector("#confidence-bar");
    const loading = document.querySelector("#loading");

    // Initialize AOS animations
    AOS.init({
        duration: 1000,
        once: true,
        mirror: false,
        disable: window.innerWidth < 768
    });

    // Initialize particles.js
    particlesJS("particles-js", {
        particles: {
            number: {
                value: 50,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: "#ffffff"
            },
            shape: {
                type: "circle",
                stroke: {
                    width: 0,
                    color: "#000000"
                },
            },
            opacity: {
                value: 0.2,
                random: true,
                animation: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                animation: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#ffffff",
                opacity: 0.1,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: {
                    enable: true,
                    mode: "grab"
                },
                onclick: {
                    enable: false
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 0.3
                    }
                }
            }
        },
        retina_detect: true
    });

    // Handle click on drop zone
    dropZone.addEventListener("click", (e) => {
        fileInput.click();
    });

    // Handle file input change
    fileInput.addEventListener("change", (e) => {
        if (fileInput.files.length) {
            updateThumbnail(dropZone, fileInput.files[0]);
        }
    });

    // Handle drag events
    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("drop-zone--over");
    });

    ["dragleave", "dragend"].forEach((type) => {
        dropZone.addEventListener(type, (e) => {
            dropZone.classList.remove("drop-zone--over");
        });
    });

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            updateThumbnail(dropZone, e.dataTransfer.files[0]);
        }
        
        dropZone.classList.remove("drop-zone--over");
    });

    // Form submission
    uploadForm.addEventListener("submit", function(e) {
        e.preventDefault();
        
        if (!fileInput.files.length) {
            showNotification("Please select an image first.", "warning");
            return;
        }

        // Check file type
        const file = fileInput.files[0];
        if (!file.type.match('image.*')) {
            showNotification("Please upload an image file (JPG, PNG, etc).", "error");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        // Show loading spinner
        loading.style.display = "block";
        resultContainer.style.display = "none";

        // Remove any previous alert messages
        const previousAlert = document.querySelector('.alert-message');
        if (previousAlert) previousAlert.remove();

        // Add loading text animation
        const loadingText = document.querySelector('.loading-text');
        let dots = 0;
        const loadingInterval = setInterval(() => {
            dots = (dots + 1) % 4;
            loadingText.textContent = 'Processing' + '.'.repeat(dots);
        }, 500);

        // Send request to server
        fetch("/predict", {
            method: "POST",
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            clearInterval(loadingInterval);
            loading.style.display = "none";
            
            if (data.error) {
                showNotification(data.error, "error");
                return;
            }
            
            // Display results with animation
            displayResults(data);
        })
        .catch(error => {
            clearInterval(loadingInterval);
            loading.style.display = "none";
            showNotification("Error: " + error.message, "error");
            console.error("Error:", error);
        });
    });

    // Update thumbnail preview
    function updateThumbnail(dropZone, file) {
        let thumbnailElement = dropZone.querySelector(".drop-zone-prompt");
        
        // First time - hide the prompt text
        if (thumbnailElement) {
            thumbnailElement.style.display = "none";
        }
        
        // Show preview image
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            
            reader.readAsDataURL(file);
            reader.onload = () => {
                // Display preview with animation
                previewImage.style.opacity = "0";
                previewImage.style.display = "block";
                previewOverlay.style.display = "flex";
                
                setTimeout(() => {
                    previewImage.src = reader.result;
                    previewImage.style.transition = "opacity 0.5s ease, transform 0.5s ease";
                    previewImage.style.opacity = "1";
                }, 50);
                
                // Hide any previous results
                resultContainer.style.display = "none";
                
                // Remove any previous alert messages
                const previousAlert = document.querySelector('.alert-message');
                if (previousAlert) previousAlert.remove();
            };
        } else {
            showNotification("Please upload an image file (JPG, PNG, etc).", "warning");
        }
    }

    // Display prediction results
    function displayResults(data) {
        // Remove any previous alert messages
        const previousAlert = document.querySelector('.alert-message');
        if (previousAlert) previousAlert.remove();
        
        // Set breed value
        breedResult.textContent = data.breed;
        
        // Get the parent element to add/remove classes
        const breedBox = document.querySelector('.breed-result-box');
        
        // Check if the image is likely a dog
        if (data.is_dog === false) {
            // Style as not-dog result
            breedBox.classList.add("not-dog");
            
            // Add warning message after breed box
            const warningMsg = document.createElement('div');
            warningMsg.className = 'alert-message';
            warningMsg.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <p>${data.message || "This doesn't appear to be a dog image."}</p>
            `;
            
            // Insert after breed result
            breedBox.insertAdjacentElement('afterend', warningMsg);
        } else {
            // Normal dog breed display
            breedBox.classList.remove("not-dog");
        }
        
        // Reset and animate confidence display
        confidenceResult.textContent = "0";
        confidenceBar.style.width = "0%";
        
        // Get confidence value
        const confidence = parseFloat(data.confidence).toFixed(2);
        
        // Animate counter for confidence value
        animateCounter(0, confidence, 1500, value => {
            confidenceResult.textContent = value;
        });
        
        // Animate progress bar with delay for sequential effect
        setTimeout(() => {
            confidenceBar.style.width = confidence + "%";
            
            // Set color based on confidence
            setConfidenceBarColor(confidence);
        }, 300);
        
        // Show results container with animation
        resultContainer.style.opacity = "0";
        resultContainer.style.transform = "translateY(20px)";
        resultContainer.style.display = "block";
        
        setTimeout(() => {
            resultContainer.style.transition = "opacity 0.5s ease, transform 0.5s ease";
            resultContainer.style.opacity = "1";
            resultContainer.style.transform = "translateY(0)";
        }, 50);
    }
    
    // Set color for confidence bar
    function setConfidenceBarColor(confidence) {
        const confValue = parseInt(confidence);
        if (confValue < 50) {
            confidenceBar.style.background = "linear-gradient(90deg, #f72585, #b5179e)";
            confidenceResult.style.color = "#f72585";
        } else if (confValue < 80) {
            confidenceBar.style.background = "linear-gradient(90deg, #ffd166, #ef8e19)";
            confidenceResult.style.color = "#ffd166";
        } else {
            confidenceBar.style.background = "linear-gradient(90deg, #70e000, #38b000)";
            confidenceResult.style.color = "#70e000";
        }
    }
    
    // Animate counter for smooth number transitions
    function animateCounter(start, end, duration, callback) {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use easeOutQuad easing function for smoother finish
            const easeProgress = 1 - (1 - progress) * (1 - progress);
            
            const value = parseFloat(easeProgress * (end - start) + start).toFixed(2);
            callback(value);
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
    
    // Show notifications/alerts
    function showNotification(message, type = "info") {
        // You can replace this with a toast notification system
        const colors = {
            info: "#3a86ff",
            warning: "#ffd166",
            error: "#f72585"
        };
        
        // Create notification element
        const notification = document.createElement("div");
        notification.className = "custom-notification";
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Style notification
        Object.assign(notification.style, {
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "rgba(30, 30, 40, 0.95)",
            color: "#fff",
            borderLeft: `4px solid ${colors[type]}`,
            borderRadius: "5px",
            padding: "12px 20px",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
            zIndex: "9999",
            transform: "translateX(120%)",
            transition: "transform 0.3s ease"
        });
        
        // Add to document
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = "translateX(0)";
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = "translateX(120%)";
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }
});