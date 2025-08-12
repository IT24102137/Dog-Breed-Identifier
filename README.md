# Dog Breed Identifier 🐶

A modern AI-powered web application for identifying dog breeds from images, built with **TensorFlow**, **Flask**, and a beautiful animated frontend.

## 🚀 Features

- **Deep Learning Model**: Uses a pre-trained TensorFlow model to classify over 120+ dog breeds.
- **Non-Dog Detection**: Smart warning for non-dog images using confidence threshold.
- **Modern UI/UX**: Animated gradient backgrounds, particles, and glassmorphism design.
- **Live Preview**: Interactive image upload and preview frame.
- **Animated Confidence Meter**: Color-coded and animated confidence bar.
- **Responsive Design**: Looks great on all devices.
- **Notifications**: Custom notification system for errors and info.
- **Social Branding**: Creator info and social media links.

## 🖼️ Screenshots

![Dog Breed Identifier Screenshot](https://cdn.jsdelivr.net/gh/it24102137/assets/dog-breed-identifier-screenshot.png)

## 🧑‍💻 Creator

**Janith Deshan**

- 📧 Email: janithmihijaya123@gmail.com
- 🔗 [Facebook](https://www.facebook.com/janith.deshan.186)
- 💼 [LinkedIn](https://www.linkedin.com/in/janithdeshan/)
- 💻 [GitHub](https://github.com/janiyax35)
- 📸 [Instagram](https://www.instagram.com/janith_deshan11/)

---

## 🛠️ Tech Stack

- **Backend:** Flask, TensorFlow, Python
- **Frontend:** HTML5, CSS3, JavaScript
- **Libraries:** Bootstrap, Font Awesome, AOS, particles.js

---

## 📦 Installation & Usage

1. **Clone the repository:**
   ```bash
   git clone https://github.com/janiyax35/dog-breed-identifier.git
   cd dog-breed-identifier
   ```

2. **Set up a virtual environment (recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Add your model files:**
   - Place `dog_breed_model.h5` and `class_indices.json` in the project root.

5. **Run the server:**
   ```bash
   python app.py
   ```

6. **Open your browser:**
   - Visit [http://127.0.0.1:5000/](http://127.0.0.1:5000/)

---

## 📝 How It Works

- Upload a dog image using the drag & drop box.
- The model predicts the breed and confidence.
- If a non-dog image is uploaded, the app shows a warning instead of a misleading breed.
- All results are animated for a smooth user experience.

---

## 🐾 Model Info

- Trained on the [Stanford Dogs Dataset](http://vision.stanford.edu/aditya86/ImageNetDogs/)
- Uses transfer learning (MobileNetV2) for high accuracy and speed.

---

## 📁 Project Structure

```
dog-breed-identifier/
├── static/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── uploads/
├── templates/
│   └── index.html
├── app.py
├── model.py
├── requirements.txt
├── dog_breed_model.h5
├── class_indices.json
└── README.md
```

---

## ⚡ Credits

- [Stanford Dogs Dataset](http://vision.stanford.edu/aditya86/ImageNetDogs/)
- [Bootstrap](https://getbootstrap.com/)
- [Font Awesome](https://fontawesome.com/)
- [AOS](https://michalsnik.github.io/aos/)
- [particles.js](https://vincentgarreau.com/particles.js/)

---

## 🏷️ License

This project is MIT licensed. See [LICENSE](LICENSE) for details.

---

**Project by Janith Deshan | IT24102137**
