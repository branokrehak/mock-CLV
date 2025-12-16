import { reacter } from "../utils/react";
import { AppModel } from "./app-model";

export const Footer = reacter(function Footer({ app }: { app: AppModel }) {
  return (
    <footer>
      <p>
        CLV version: <em>{app.clvVersion}</em>
        <br />
        API environment:{" "}
        <em>
          {app.seerlinqApi.apiInfo ? app.seerlinqApi.apiInfo.environment : ""}
        </em>{" "}
        | API version:{" "}
        <em>
          {app.seerlinqApi.apiInfo ? app.seerlinqApi.apiInfo.version : ""}
        </em>
        <br />
        <br />
        Copyright &copy; {new Date().getFullYear()} Seerlinq
        <br />
        <br />
        C'est La Vie
      </p>
    </footer>
  );
});
