import { useState } from "react";
import { apiPostUsersChangePassword } from "../../api";
import { ApiConnector, RequestError } from "../../api/api-connector";
import { Button } from "../../components/ui-kit/button";
import { Dialog } from "../../components/ui-kit/dialog";
import { PasswordField } from "../../components/ui-kit/fields/password-field";
import { Form } from "../../components/ui-kit/form/form";
import { FormRow } from "../../components/ui-kit/form/form-row";
import { InvisibleTable } from "../../components/ui-kit/form/invisible-table";

export function ChangePasswordDialog({
  api,
  onClose,
}: {
  api: ApiConnector;
  onClose: () => void;
}) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    // Validate passwords match
    if (newPassword !== repeatPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      // First, relogin with old password to get a fresh access token
      await api.relogin(oldPassword);

      // Now change the password
      await apiPostUsersChangePassword({
        body: {
          old_password: oldPassword,
          new_password: newPassword,
          repeat_password: repeatPassword,
        },
        meta: { ignore401: true },
      });

      setSuccess(true);
    } catch (error) {
      if (error instanceof RequestError) {
        if (error.response.status === 401) {
          alert("Incorrect current password");
        } else if (
          error.data &&
          typeof error.data === "object" &&
          "detail" in error.data
        ) {
          alert(String(error.data.detail));
        } else {
          alert("Failed to change password");
        }
      } else {
        throw error;
      }
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <div className="flex flex-col gap-4">
        {success ? (
          <>
            <h2 className="text-xl font-semibold m-0 p-0">
              Password Changed Successfully
            </h2>
            <p className="m-0">Your password has been changed successfully.</p>
            <div className="flex justify-end">
              <Button onClick={onClose}>Close</Button>
            </div>
          </>
        ) : (
          <Form onSubmit={handleSubmit}>
            <h2 className="text-xl font-semibold m-0 p-0 mb-4">
              Change password
            </h2>

            <InvisibleTable dataAdd>
              <FormRow
                label="Current password"
                data={
                  <PasswordField
                    autofocus
                    value={oldPassword}
                    onChange={setOldPassword}
                    required
                  />
                }
              />

              <FormRow
                label="New password"
                data={
                  <PasswordField
                    value={newPassword}
                    onChange={setNewPassword}
                    required
                  />
                }
              />

              <FormRow
                label="Repeat new password"
                data={
                  <PasswordField
                    value={repeatPassword}
                    onChange={setRepeatPassword}
                    required
                  />
                }
              />
            </InvisibleTable>

            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Change password</Button>
            </div>
          </Form>
        )}
      </div>
    </Dialog>
  );
}
