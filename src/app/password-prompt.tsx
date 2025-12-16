import { useState } from "react";
import { ApiConnector, RequestError } from "../api/api-connector";
import { Button } from "../components/ui-kit/button";
import { Dialog } from "../components/ui-kit/dialog";
import { PasswordField } from "../components/ui-kit/fields/password-field";
import { Form } from "../components/ui-kit/form/form";

export function PasswordPrompt({ api }: { api: ApiConnector }) {
  const [password, setPassword] = useState("");

  return (
    <Dialog open>
      <Form
        onSubmit={async () => {
          try {
            await api.relogin(password);
          } catch (error) {
            if (
              error instanceof RequestError &&
              error.response.status === 401
            ) {
              setPassword("");
              alert(JSON.stringify(error.data));
            } else {
              throw error;
            }
          }
        }}
      >
        <div className="flex flex-col">
          <div className="mb-2">Please confirm with your password.</div>

          <PasswordField
            autofocus
            value={password}
            onChange={(newValue) => {
              setPassword(newValue);
            }}
          />

          <div className="h-2" />

          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                api.cancelPasswordPrompt();
              }}
            >
              Cancel
            </Button>

            <Button type="submit">Confirm</Button>
          </div>
        </div>
      </Form>
    </Dialog>
  );
}
