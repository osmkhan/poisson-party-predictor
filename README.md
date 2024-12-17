Here's a clean and concise README for **Poisson Party Predictor**:

---

# 🎉 Poisson Party Predictor

**Poisson Party Predictor** is a React-based interactive tool that uses Poisson distribution to predict the number of remaining guests expected to arrive at a party in real-time. 

Made for my dear, very anxious pal who shall not be named here. 

---

## 🚀 Features

- **Real-Time Tracking**: Track guests as they arrive and see predictions adjust dynamically.
- **Poisson-Based Predictions**: Combines observed arrival rates with expected rates for accurate forecasts.
- **Interactive Visualization**: Recharts-based bar charts to display predicted additional guest probabilities.
- **Status Updates**: Custom messages based on party attendance progress.
- **Flexible Inputs**: 
  - Set total expected guests.
  - Adjust party duration (in minutes).
  - Manually track elapsed time and guest arrivals.

---

## 🛠️ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/poisson-party-predictor.git
   cd poisson-party-predictor
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the app:

   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view in your browser.

---

## 📊 How It Works

1. **Setup**:
   - Input expected total guests.
   - Set party duration (60-360 minutes).

2. **Start the Party**:
   - Begin tracking elapsed time and guest arrivals.

3. **Dynamic Predictions**:
   - The app uses **Poisson Distribution** to calculate the probability of additional arrivals.
   - Predictions combine observed arrival rates (real-time) with expected rates for robust estimates.

4. **Visualize Data**:
   - The bar chart displays the probabilities of additional arrivals.
   - Status messages adjust based on attendance progress.

---


## 🧮 Core Formulas

1. **Poisson Probability**:

   \[
   P(k, \lambda) = \frac{\lambda^k e^{-\lambda}}{k!}
   \]

   Where:
   - \( k \): Number of additional guests.
   - \( \lambda \): Predicted remaining arrivals.

2. **Dynamic Rate Calculation**:
   - Combines observed rate (so far) with expected rate to balance predictions.

---

## 📝 License

MIT License.
