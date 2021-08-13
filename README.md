# AuditPal - DocuSign Good Code Hackathon

A web app built to help streamline the Jane Goodall Institute's conservation and mapping process.

Live demo: [https://docusign2021.web.app](https://docusign2021.web.app)

## Inspiration

We were inspired to create AuditPal as a tool to help the Jane Goodall Institute, because of their important mission of preserving chimpanzee habitats. We strongly believe in the Jane Goodall Institute’s vision of creating a healthy planet, and our tool aims to help them accomplish their goal.

## What it does

AuditPal optimizes the process of reviewing and approving conservation maps in accordance to Open Conservation Standards. It integrates closely with important tools such as Esri ArcGIS Online and the DocuSign eSignature API to make the process more efficient for stakeholders and experts. The platform makes it possible to share and obtain feedback from non-ArcGIS users. Users create audits which are shared with reviewers and stakeholders. Experts can add reviews through the web app's map component and add any additional comments or upload files for the ArcGIS user to modify the map with. The app supports multiple review cycles and once the process has been completed, sends a DocuSign envelope which includes all the comments and map revisions to all stakeholders and reviewers to sign approval.

## How we built it

AuditPal is a full-stack application built with a React frontend, Express backend, and uses MongoDB to store data. It uses APIs from Esri ArcGIS and DocuSign to implement important functionality.

## Challenges we ran into

We ran into several challenges when implementing the map component as well as determining the best way to embed an ArcGIS map into a DocuSign envelope. We found that the ArcGIS JavaScript API supports a sketch layer which allows a user to add shapes, graphics, and comments to a map. The ArcGIS API was also used to take a screenshot of the MapView component and insert it into the DocuSign envelope. The DocuSign integration also includes a link to the web application for reviewers and stakeholders to access an interactive page with each requested change.

## Accomplishments that we're proud of

We're proud of building an application that supports a complex process within a short amount of time. Our team only learned of the hackathon several days before the deadline and rapidly developed our project. We're happy with the application we've built that implements several ArcGIS and DocuSign integrations.

## What we learned

We gained experience working with Esri ArcGIS APIs and map components, as well as creating envelopes with the DocuSign APIs. Exporting and persisting data from the Esri ArcGIS maps was a critical learning point for the team.

## What's next for AuditPal

We hope to have the chance to work with the Jane Goodall Institute to further develop the app to implement more flexibility around adding comments and graphics to maps, as well as adding additional data to support modification requests. Since the app was developed in a short amount of time, we would like to improve the robustness and security of the app for greater scalability.

## Project Setup

This project requires a `.env` file to be placed in the root directory with the following fields:

```
REACT_APP_ESRI_KEY=
REACT_APP_DOCUSIGN_INTEGRATION_KEY=
REACT_APP_DOCUSIGN_REDIRECT_URI=http://localhost:3000/oauth/docusign_redirect
SECRET=
MONGODB_URI=
DOCUSIGN_INTEGRATION_KEY=
DS_API_ACCOUNT_ID=
```

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Concurrently runs the app and the server.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
