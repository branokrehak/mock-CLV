import * as PopoverPrimitive from "@radix-ui/react-popover";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import logoPng from "../../../public/static/sq_logo.png";
import { Button } from "../../components/ui-kit/button";
import { PopoverContent } from "../../components/ui-kit/popover";
import { reacter } from "../../utils/react";
import { AppModel } from "../app-model";
import styles from "./main-header.module.css";

export const MainHeader = reacter(function MainHeader({
  app,
}: {
  app: AppModel;
}) {
  const narrow = window.innerWidth < 700;

  const menuItems = useMemo(
    () =>
      [
        <Link key="patients" to="/">
          List of Patients
        </Link>,
        app.seerlinqApi.canIAddPatients && (
          <Link key="add-patient" to="/add-patient">
            Add new Patient
          </Link>
        ),
      ].filter(Boolean),
    [app],
  );

  return (
    <div
      className={`sticky top-0 bg-white z-40 flex items-center px-4 py-2 ${styles.root}`}
    >
      {narrow ? (
        <>
          <PopoverPrimitive.Root>
            <PopoverPrimitive.Trigger className="bg-transparent border-none p-3 text-xl">
              ☰
            </PopoverPrimitive.Trigger>

            <PopoverPrimitive.Portal>
              <PopoverContent className="z-50 p-4">
                <ul className={styles.nav}>
                  {menuItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </PopoverContent>
            </PopoverPrimitive.Portal>
          </PopoverPrimitive.Root>

          <div className="grow" />
        </>
      ) : (
        <>
          <div>
            <Link to="/" className={`flex items-center ${styles.logo}`}>
              <img src={logoPng} />
              <div>
                <div className="text-2xl font-bold">CLV</div>
              </div>
            </Link>
          </div>

          <ul className={`grow ${styles.nav} ${styles.navWide}`}>
            {menuItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </>
      )}

      <div className="flex items-center justify-end">
        <i
          className={app.darkMode ? "fas fa-sun" : "far fa-moon"}
          onClick={() => {
            app.toggleDarkMode();
          }}
        />

        <div className="w-4" />

        <Link to="/account" className="hover:underline cursor-pointer">
          {app.seerlinqApi.username}
        </Link>

        <div className="w-4" />

        <Button
          onClick={() => {
            app.seerlinqApi.logout();
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
});
