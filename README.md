# Seerlinq simple frontend

## Prerequisites

Node: See the `.nvmrc` file for the right version. Check out [nvm](https://github.com/nvm-sh/nvm) for convenient Node versions management.

## Setup

Install dependencies with `npm install`.

## Project Structure

```
src/
├── app/           # Application entry point & application services
├── api/           # API client and auto-generated types
├── models/        # Shared data models
├── components/    # Shared React components
├── features/      # Feature modules
├── config/
├── constants/
├── types/         # Shared types
└── utils/         # Simple utility functions
```

## Development

Run `npm run dev` and open http://localhost:3000.

## Assignment

Please implement another page called **Medications**. The page should be accessible via the sidebar from patient's details. Use the `apiGetPatientsPatientIdMedications` function to fetch (mocked) data and display a table with the following columns:

- Started (`medication_started`)
- Ended (`medication_ended`)
- Group (`medication_group`)
- Name (`medication_name`)
- Dose (`medication_dose`)
- Unit (`medication_unit`)
- Comment (`comment`)

It should also be possible to:

- Add a new row. See how this works in Labs. In contrast to Labs you can start with just a single row.
- Edit a row. Make `medication_started`, `medication_ended`, `medication_dose`, `medication_unit` and `comment` editable.
- Delete a row

When you go over the code and the app, feel free to take note of things you would change or do differently (and why). You can even implement some changes right away, if you like. Treat this as a secondary task.

Please follow good version control practices.
