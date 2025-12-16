import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui-kit/button";
import { PasswordField } from "../components/ui-kit/fields/password-field";
import { Form } from "../components/ui-kit/form/form";
import { AppModel } from "./app-model";

export function LoginRoute(props: { app: AppModel }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="grow flex items-center justify-center">
      <div className="flex flex-col w-80">
        <h2 className="text-2xl font-semibold mb-6">Log in</h2>

        <Form
          className="flex flex-col"
          onSubmit={() => props.app.seerlinqApi.login(username, password)}
        >
          <div className="grid grid-cols-[max-content_1fr] gap-x-2 gap-y-3 items-center mb-6">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
              }}
              autoFocus
            />
            <label>Password:</label>
            <PasswordField
              value={password}
              onChange={(newValue) => {
                setPassword(newValue);
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Forgot password?
            </Link>

            <Button type="submit">Log In</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
