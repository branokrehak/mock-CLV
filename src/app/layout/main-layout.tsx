import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Spinner } from "../../components/ui-kit/spinner";
import { reacter } from "../../utils/react";
import { AppModel } from "../app-model";
import { PasswordPrompt } from "../password-prompt";
import { MainHeader } from "./main-header";

export const MainLayout = reacter(function MainLayout(props: {
  app: AppModel;
}) {
  useEffect(() => {
    props.app.seerlinqApi.assumeLoggedIn();
  }, [props.app.seerlinqApi]);

  return (
    <>
      {props.app.seerlinqApi.promptPassword && (
        <PasswordPrompt api={props.app.seerlinqApi} />
      )}

      {props.app.seerlinqApi.loggedIn ? (
        <>
          <MainHeader app={props.app} />
          <Outlet />
        </>
      ) : (
        <div className="grow flex items-center justify-center">
          <Spinner />
        </div>
      )}
    </>
  );
});
