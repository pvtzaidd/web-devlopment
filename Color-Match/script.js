document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const sections = document.querySelectorAll('.main-section');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const themeToggleBtn = document.getElementById('themeToggleBtn');

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('colorMatch_theme');
    if (savedTheme === 'night') {
        document.body.classList.add('night-theme');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // --- Navigation Logic ---
    const showSection = (id) => {
        sections.forEach(section => {
            section.classList.remove('active');
        });
        const targetSection = document.getElementById(id);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            showSection(targetId);
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    });

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // --- Theme Toggle Functionality ---
    themeToggleBtn.addEventListener('click', () => {
        if (document.body.classList.contains('night-theme')) {
            document.body.classList.remove('night-theme');
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('colorMatch_theme', 'day');
        } else {
            document.body.classList.add('night-theme');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('colorMatch_theme', 'night');
        }
    });

    // --- Custom Alert Modal ---
    function showCustomAlert(title, message, callback) {
        const overlay = document.getElementById('customAlertOverlay');
        const alertTitle = document.getElementById('alertTitle');
        const alertMessage = document.getElementById('alertMessage');
        const alertOkButton = document.getElementById('alertOkButton');
        if (overlay) {
            alertTitle.textContent = title;
            alertMessage.textContent = message;
            overlay.classList.add('active');
            const handleOkClick = () => {
                overlay.classList.remove('active');
                alertOkButton.removeEventListener('click', handleOkClick);
                if (callback && typeof callback === 'function') {
                    callback();
                }
            };
            alertOkButton.addEventListener('click', handleOkClick);
        }
    }

    // --- Contact Form Logic ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showCustomAlert('Message Sent!', 'Thank you for your message. We will get back to you soon!', () => {
                contactForm.reset();
            });
        });
    }

    // --- About Us Section "Know More" Toggle ---
    const moreContent = document.getElementById("moreContent");
    window.toggleMore = () => {
        if (moreContent) {
            moreContent.classList.toggle("hidden");
        }
    };

    // --- Password Visibility Toggle for Login and Registration ---
    window.togglePasswordVisibility = (fieldId) => {
        const passwordField = document.getElementById(fieldId);
        const icon = passwordField.nextElementSibling.querySelector('i');
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordField.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    };

    // --- Registration Form Validation ---
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        registrationForm.addEventListener('submit', (e) => {
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;
            const passwordMatchError = document.getElementById('password-match-error');
            if (password !== confirmPassword) {
                e.preventDefault();
                passwordMatchError.classList.remove('hidden');
            } else {
                passwordMatchError.classList.add('hidden');
                showCustomAlert('Success!', 'Account created. You can now log in.', () => {
                    window.location.hash = 'login';
                });
            }
        });
    }

    // --- Dashboard/AI Analyzer Logic ---
    const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
    const useWebcamBtn = document.getElementById('useWebcamBtn');
    const chooseSwatchBtn = document.getElementById('chooseSwatchBtn');
    const photoInput = document.getElementById('photoInput');
    const webcamContainer = document.getElementById('webcamContainer');
    const webcamVideo = document.getElementById('webcamVideo');
    const captureBtn = document.getElementById('captureBtn');
    const capturedImage = document.getElementById('capturedImage');
    const photoPreviewContainer = document.getElementById('photoPreviewContainer');
    const photoPreview = document.getElementById('photoPreview');
    const photoName = document.getElementById('photoName');
    const swatchContainer = document.getElementById('swatchContainer');
    const skinSwatches = document.querySelectorAll('[data-tone]');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsSection = document.getElementById('resultsSection');
    const colorResults = document.getElementById('colorResults');
    const resultToggle = document.getElementById('resultToggle');

    let currentInputMethod = null;
    let selectedSkinTone = null;
    let capturedImageBase64 = null;
    let showTenColors = false;
    let stream = null;

    // Color suggestions for different skin tones
    const colorSuggestions = {
        light: [
            { name: "Peach Blush", hex: "#FFDAB9" },
            { name: "Warm Beige", hex: "#DCAE96" },
            { name: "Soft Teal", hex: "#B2D8D8" },
            { name: "Lavender Mist", hex: "#E6E6FA" },
            { name: "Coral Pink", hex: "#F88379" },
            { name: "Pale Gold", hex: "#FAD5A5" },
            { name: "Powder Blue", hex: "#B0E0E6" },
            { name: "Mint Cream", hex: "#F5FFFA" },
            { name: "Rose Quartz", hex: "#F7CAC9" },
            { name: "Light Salmon", hex: "#FFA07A" }
        ],
        fair: [
            { name: "Salmon", hex: "#FA8072" },
            { name: "Sage Green", hex: "#BCB88A" },
            { name: "Cornflower Blue", hex: "#6495ED" },
            { name: "Peach", hex: "#FDD5B1" },
            { name: "Thistle", hex: "#D8BFD8" },
            { name: "Light Coral", hex: "#F08080" },
            { name: "Pale Turquoise", hex: "#AFEEEE" },
            { name: "Wheat", hex: "#F5DEB3" },
            { name: "Plum", hex: "#DDA0DD" },
            { name: "Light Sky Blue", hex: "#87CEFA" }
        ],
        medium: [
            { name: "Coral", hex: "#FF7F50" },
            { name: "Olive", hex: "#808000" },
            { name: "Royal Blue", hex: "#4169E1" },
            { name: "Terracotta", hex: "#E2725B" },
            { name: "Mustard", hex: "#FFDB58" },
            { name: "Tomato", hex: "#FF6347" },
            { name: "Steel Blue", hex: "#4682B4" },
            { name: "Goldenrod", hex: "#DAA520" },
            { name: "Indian Red", hex: "#CD5C5C" },
            { name: "Medium Sea Green", hex: "#3CB371" }
        ],
        olive: [
            { name: "Teal", hex: "#008080" },
            { name: "Burgundy", hex: "#800020" },
            { name: "Copper", hex: "#CD7F32" },
            { name: "Forest Green", hex: "#228B22" },
            { name: "Plum Purple", hex: "#8E4585" },
            { name: "Dark Slate Gray", hex: "#2F4F4F" },
            { name: "Sienna", hex: "#A0522D" },
            { name: "Olive Drab", hex: "#6B8E23" },
            { name: "Cadet Blue", hex: "#5F9EA0" },
            { name: "Chocolate", hex: "#D2691E" }
        ],
        dark: [
            { name: "Fuchsia", hex: "#FF00FF" },
            { name: "Royal Blue", hex: "#4169E1" },
            { name: "Emerald", hex: "#50C878" },
            { name: "Orange Red", hex: "#FF4500" },
            { name: "Gold", hex: "#FFD700" },
            { name: "Hot Pink", hex: "#FF69B4" },
            { name: "Deep Sky Blue", hex: "#00BFFF" },
            { name: "Lime Green", hex: "#32CD32" },
            { name: "Violet", hex: "#EE82EE" },
            { name: "Turquoise", hex: "#40E0D0" }
        ]
    };

    // Update UI state based on selected input method
    const updateUIState = (method) => {
        currentInputMethod = method;

        // Reset all buttons to secondary style
        uploadPhotoBtn.classList.remove('btn-primary-custom');
        uploadPhotoBtn.classList.add('btn-secondary-custom');

        useWebcamBtn.classList.remove('btn-primary-custom');
        useWebcamBtn.classList.add('btn-secondary-custom');

        chooseSwatchBtn.classList.remove('btn-primary-custom');
        chooseSwatchBtn.classList.add('btn-secondary-custom');

        // Hide all input containers
        webcamContainer.classList.add('hidden');
        photoPreviewContainer.classList.add('hidden');
        swatchContainer.classList.add('hidden');

        // Show appropriate container and update button style
        if (method === 'photo') {
            uploadPhotoBtn.classList.remove('btn-secondary-custom');
            uploadPhotoBtn.classList.add('btn-primary-custom');
            photoPreviewContainer.classList.remove('hidden');
        } else if (method === 'webcam') {
            useWebcamBtn.classList.remove('btn-secondary-custom');
            useWebcamBtn.classList.add('btn-primary-custom');
            webcamContainer.classList.remove('hidden');
            startWebcam();
        } else if (method === 'swatch') {
            chooseSwatchBtn.classList.remove('btn-secondary-custom');
            chooseSwatchBtn.classList.add('btn-primary-custom');
            swatchContainer.classList.remove('hidden');
        }

        localStorage.setItem('colorMatch_inputMethod', method);
    };

    // Webcam functionality
    const startWebcam = async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            webcamVideo.srcObject = stream;
            webcamVideo.style.display = 'block';
            captureBtn.style.display = 'block';
            capturedImage.style.display = 'none';
        } catch (error) {
            console.error('Webcam error:', error);

            let errorMessage = "Could not access your webcam. Please try the following:\n\n";
            errorMessage += "1. Make sure you are running this on a local server (not by opening the file directly).\n";
            errorMessage += "2. Check that your webcam is connected and not in use by another application.\n";
            errorMessage += "3. Ensure you click 'Allow' when the browser asks for camera permission.\n";
            errorMessage += "4. Try refreshing the page or using a different browser.\n\n";
            errorMessage += `Technical Details: ${error.name}`;

            showCustomAlert('Webcam Error', errorMessage);
        }
    };

    const stopWebcam = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            webcamVideo.srcObject = null;
        }
    };

    // Event Listeners
    uploadPhotoBtn.addEventListener('click', () => {
        photoInput.click();
    });

    useWebcamBtn.addEventListener('click', () => {
        updateUIState('webcam');
    });

    chooseSwatchBtn.addEventListener('click', () => {
        updateUIState('swatch');
    });

    photoInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.size > 25 * 1024 * 1024) {
                showCustomAlert('File Too Large', 'Please select an image under 25MB.');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                photoPreview.src = event.target.result;
                photoName.textContent = file.name;
                updateUIState('photo');
                analyzeBtn.disabled = false;

                // Convert to base64 for API (if needed)
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    capturedImageBase64 = canvas.toDataURL('image/jpeg').split(',')[1];
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    captureBtn.addEventListener('click', () => {
        // Capture image from webcam
        const canvas = document.createElement('canvas');
        canvas.width = webcamVideo.videoWidth;
        canvas.height = webcamVideo.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(webcamVideo, 0, 0, canvas.width, canvas.height);

        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/jpeg');
        capturedImage.src = dataUrl;
        capturedImage.style.display = 'block';
        webcamVideo.style.display = 'none';
        captureBtn.style.display = 'none';

        // Save base64 for API (remove data:image/jpeg;base64, prefix)
        capturedImageBase64 = dataUrl.split(',')[1];

        // Enable analyze button
        analyzeBtn.disabled = false;

        // Stop webcam stream
        stopWebcam();
    });

    skinSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            skinSwatches.forEach(s => s.style.boxShadow = 'none');
            swatch.style.boxShadow = '0 0 0 3px var(--accent)';
            selectedSkinTone = swatch.dataset.tone;
            analyzeBtn.disabled = false;
        });
    });

    resultToggle.addEventListener('change', () => {
        showTenColors = resultToggle.checked;
    });

    analyzeBtn.addEventListener('click', async () => {
        if (!currentInputMethod) {
            showCustomAlert('Missing Input', 'Please select an input method: Upload Photo, Use Webcam, or Choose Swatch');
            return;
        }

        if (currentInputMethod === 'swatch' && !selectedSkinTone) {
            showCustomAlert('Missing Selection', 'Please select a skin tone swatch.');
            return;
        }

        if ((currentInputMethod === 'photo' && !photoInput.files[0]) &&
            (currentInputMethod === 'webcam' && !capturedImageBase64)) {
            showCustomAlert('Missing Photo', 'Please upload a photo or capture one with your webcam.');
            return;
        }

        loadingIndicator.classList.remove('hidden');
        resultsSection.classList.add('hidden');
        analyzeBtn.disabled = true;

        // Simulate API call delay
        setTimeout(() => {
            let colorsToShow = [];

            if (currentInputMethod === 'swatch') {
                colorsToShow = colorSuggestions[selectedSkinTone].slice(0, showTenColors ? 10 : 5);
            } else {
                // For photo or webcam, we'll use a random skin tone for demo purposes
                // In a real app, you would analyze the image to determine skin tone
                const skinTones = ['light', 'fair', 'medium', 'olive', 'dark'];
                const randomTone = skinTones[Math.floor(Math.random() * skinTones.length)];
                colorsToShow = colorSuggestions[randomTone].slice(0, showTenColors ? 10 : 5);
            }

            loadingIndicator.classList.add('hidden');

            if (colorsToShow.length > 0) {
                colorResults.innerHTML = '';
                colorsToShow.forEach(color => {
                    const card = document.createElement('div');
                    card.className = 'color-swatch';
                    card.innerHTML = `
                                <div class="color-block" style="background-color: ${color.hex};"></div>
                                <div class="color-info mt-2 text-center">
                                    <h4 class="font-semibold text-lg">${color.name}</h4>
                                    <span class="text-sm text-gray-500">${color.hex}</span>
                                </div>
                            `;
                    colorResults.appendChild(card);
                });
                resultsSection.classList.remove('hidden');
            } else {
                showCustomAlert('No Results', 'No color palette could be generated from your selection. Please try a different image or swatch.');
            }

            analyzeBtn.disabled = false;
        }, 1500); // Simulate 1.5 second processing time
    });
});