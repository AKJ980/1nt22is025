
# Drought Prediction Model

This project develops a model to predict consecutive drought months for different subdivisions in India based on historical rainfall data.

## Project Overview

The goal is to predict the number of consecutive drought months starting from a given month for a specific state (subdivision), stopping at the first predicted non-drought month. Additionally, the model identifies periods that are "Best time to plant" if no immediate drought is predicted and indicates the next expected drought month in such cases.

## Dataset

The dataset used is located at `/content/Sub_Division_IMD_2017.csv` and contains historical monthly rainfall data for various subdivisions in India up to the year 2017.

## Methodology

The project follows these key steps:

1.  **Data Loading:** The rainfall data is loaded into a pandas DataFrame.
2.  **Data Preprocessing:** Missing values are handled by dropping rows, and relevant monthly rainfall columns, subdivision, and year are selected.
3.  **Feature Engineering:** New features are created to improve prediction accuracy, including:
    *   Annual rainfall.
    *   Seasonal indicators.
    *   Lagged rainfall values (up to 6 months).
    *   Rolling average rainfall (over 3 and 6 months).
    *   Historical monthly median rainfall for each subdivision.
    *   A drought indicator based on monthly rainfall being less than or equal to 50mm.
4.  **Data Splitting:** The data is split into training and testing sets using a chronological split to prevent data leakage, with older data used for training and newer data for testing.
5.  **Model Selection and Training:** A RandomForestClassifier model is chosen and trained on the prepared training data.
6.  **Model Evaluation:** The model's performance is evaluated using metrics such as Accuracy, Precision, Recall, and F1-score on the test set.
7.  **Prediction Logic Implementation:** A Python function is implemented to:
    *   Take a state (subdivision) and a starting month as input.
    *   Predict consecutive drought months from the input month onwards in the latest year of data.
    *   Stop counting at the first predicted non-drought month (rainfall > 50mm).
    *   Identify and report "Best time to plant" if the period from the input month onwards is not predicted as drought, and indicate the next expected drought month.
    *   Output the number of consecutive drought months and the list of those months with their historical median rainfall.
    *   If no drought is predicted from the input month onwards, display the actual and historical median rainfall values for the months from the input month to December.
8.  **Output Presentation:** The prediction results are displayed to the user, including the number of consecutive drought months, the list of drought months with median rainfall, the expected month of rainfall, or the "Best time to plant" message with subsequent rainfall details.
9.  **Output Saving:** The prediction output can be saved to a text file in Google Drive.

## How to Use

1.  **Open the Google Colab Notebook:** Open the notebook containing the code for this project.
2.  **Run the Cells:** Execute the code cells sequentially from top to bottom to load data, preprocess, engineer features, train the model, and define the prediction function.
3.  **Run the Prediction Cell:** Execute the cell containing the prediction logic (which prompts for input).
4.  **Enter Input:** When prompted, enter the name of the state (SUBDIVISION) and the starting month (e.g., JAN, FEB, MAR).
5.  **View Output:** The output will display the prediction results based on your input.
6.  **Save Output (Optional):** You can run the cell designed to save the output to a text file in your Google Drive.

## Model Performance

The RandomForestClassifier model achieved the following performance metrics on the chronologically split test set:
*   Accuracy: [Insert Accuracy Value from last run]
*   Precision: [Insert Precision Value from last run]
*   Recall: [Insert Recall Value from last run]
*   F1-score: [Insert F1-score Value from last run]

*(Note: These values reflect the model's ability to classify individual months as drought or not drought based on the defined criteria and features.)*

## Future Improvements

*   **Forecasting:** Integrate time-series forecasting techniques to predict future rainfall and extend drought predictions beyond the available historical data.
*   **Alternative Models:** Explore other models suitable for time-series prediction (e.g., LSTMs, ARIMA) to compare performance.
*   **Drought Definition:** Refine the definition of a drought month based on domain expertise or further data analysis.
*   **Feature Engineering:** Explore additional relevant features (e.g., temperature, humidity, ENSO indices).

## License

[Specify your project's license here, e.g., MIT, Apache 2.0]

Hydroponics Water Requirement Model
This notebook contains a simple model to calculate the estimated water requirements for specific plant species in a hydroponic system, particularly in the context of drought conditions.

Functionality:
Data Loading: Loads a dataset containing information about various plant species and their minimum and recommended water requirements in milliliters per plant per day.
Drought Data Handling: Includes code to download and potentially analyze external drought data (although the format of the provided drought data required further processing beyond the scope of this README).
Water Requirement Calculation: Takes user input for a specific plant species, the number of plants, and the number of drought months to calculate the total estimated water needed using the formula: Total Water (mL) = Number of Plants * Minimum Water per Plant per Day (mL) * 30 * Number of Drought Months
Output Saving: Saves the calculated water requirement output to a text file in Google Drive for easy access and record-keeping.
How to Use:
Load Data: Ensure the hydrophonics.csv file is accessible in the specified path or update the code to load your data.
Run Calculation: Execute the code cell that prompts for user input (species name, number of plants, number of drought months) and the subsequent cell that performs the calculation.
Save Output (Optional): Run the code cells to mount Google Drive and save the output to a text file.
Analyze Results: Use the calculated water requirement to inform your hydroponic system planning and water management strategies during drought periods.
Data:
The model relies on the hydrophonics.csv dataset, which should contain at least the following columns:

species: Name of the plant species.
min_water_mL_per_plant_per_day: Minimum water requirement per plant per day in milliliters.
recommended_water_mL_per_plant_per_day: Recommended water requirement per plant per day in milliliters.
notes: Any additional notes about the plant, potentially including drought tolerance information.
Limitations:
The water requirement calculation is a simplified estimation based on minimum water needs and assumes a constant daily requirement over the drought period. Actual water needs may vary based on growth stage, environmental factors, and hydroponic system type.
The analysis of drought data from external sources is dependent on the data format and may require additional data cleaning and processing.
