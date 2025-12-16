import { useState } from "react";
import { ApiConnector } from "../../api/api-connector";
import { AppModel } from "../../app/app-model";
import { Page } from "../../app/layout/page";
import { Button } from "../../components/ui-kit/button";
import { FormRow } from "../../components/ui-kit/form/form-row";
import { InvisibleTable } from "../../components/ui-kit/form/invisible-table";
import { ChangePasswordDialog } from "./change-password-dialog";

export function AccountRoute({
  app,
  api,
}: {
  app: AppModel;
  api: ApiConnector;
}) {
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <Page app={app}>
      <InvisibleTable dataAdd>
        <FormRow label="Username" data={<span>{api.username}</span>} />

        <FormRow
          label="Password"
          data={
            <Button
              onClick={() => {
                setShowChangePassword(true);
              }}
            >
              Change Password
            </Button>
          }
        />
      </InvisibleTable>

      {showChangePassword && (
        <ChangePasswordDialog
          api={api}
          onClose={() => setShowChangePassword(false)}
        />
      )}
    </Page>
  );
}
