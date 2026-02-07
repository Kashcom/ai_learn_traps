# Deployment & Installation Guide: "AI & Learn Through Traps"

This application consists of two main parts:
1.  **Backend (Python FastAPI)**: Handles AI logic, Database, and API.
2.  **Mobile App (React Native/Expo)**: The student-facing mobile interface.

---

## 1. System Requirements

*   **Python**: 3.9+
*   **Node.js**: 16+
*   **npm/yarn**
*   **Android Studio / XCode**: For mobile emulation (or Expo Go app on physical device).

---

## 2. Backend Setup

The backend powers the AI generation and stores user progress.

1.  **Navigate to Backend Directory**:
    ```powershell
    cd backend
    ```

2.  **Create Virtual Environment** (Optional but recommended):
    ```powershell
    python -m venv venv
    .\venv\Scripts\activate  # Windows
    # source venv/bin/activate # Mac/Linux
    ```

3.  **Install Dependencies**:
    ```powershell
    pip install -r requirements.txt
    python -m spacy download en_core_web_sm
    ```

4.  **Run the Server**:
    ```powershell
    # Make sure to run this in the 'backend' folder
    python main.py
    ```
    *   The server will start at `http://0.0.0.0:8000`.
    *   **Note**: On Android Emulator, this maps to `http://10.0.2.2:8000`.

---

## 3. Mobile App Setup

The frontend is built with React Native and Expo.

1.  **Navigate to Mobile Directory**:
    ```powershell
    cd mobile
    ```

2.  **Install Dependencies**:
    ```powershell
    npm install
    ```

3.  **Run the App**:
    *   **Android Emulator**:
        ```powershell
        npm run android
        ```
    *   **iOS Simulator**:
        ```powershell
        npm run ios
        ```
    *   **Physical Device**:
        Install "Expo Go" from the App Store/Play Store.
        ```powershell
        npx expo start
        ```
        Then scan the QR code with your phone.

---

## 4. Features Overview

### **A. AI Trap Generation**
The system uses a Knowledge Base (`backend/ai_service.py`) to generate deceptive questions.
-   **Try it**: Select "Mathematics" on the home screen. A question like "What is 3 + 4 x 2?" will be generated.
-   **Trap**: If you select "14", the AI tells you: "Remember PEMDAS! Multiplication happens before Addition."

### **B. Textbook Parsing (Admin)**
You can upload PDFs to generate training data.
-   **API Endpoint**: `POST /upload-textbook` (use Postman or similar).
-   **Fields**: `file`, `subject`, `grade`, `board`.
-   The backend extracts chapters and questions automatically.

### **C. Gamification**
-   Student progress (XP, Level) is tracked in `traps.db`.
-   The **Home Screen** updates in real-time as you complete questions.
-   **Profile**: Check your Rank and Stats.

---

## 5. Deployment Guide (Production)

### **Backend Deployment (e.g., AWS EC2 / DigitalOcean / Render)**
1.  **Dockerize**: Create a `Dockerfile` for the python app.
2.  **Database**: Switch from SQLite to PostgreSQL for production (`SQLALCHEMY_DATABASE_URL` in `models.py`).
3.  **Reverse Proxy**: Use Nginx to serve the FastAPI app.

### **Mobile Deployment (App Store / Play Store)**
1.  **Build (EAS Build)**:
    ```powershell
    npm install -g eas-cli
    eas build --platform all
    ```
2.  **Submit**: Upload the generated `.aab` (Android) or `.ipa` (iOS) to the respective stores.
