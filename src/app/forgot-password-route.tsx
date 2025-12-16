import { useState } from "react";
import { Link } from "react-router-dom";
import { apiPutUsersForgotPassword } from "../api";
import { RequestError } from "../api/api-connector";
import { Button } from "../components/ui-kit/button";
import { ErrorMessage } from "../components/ui-kit/error-message";
import { Form } from "../components/ui-kit/form/form";
import { SuccessMessage } from "../components/ui-kit/success-message";
import { AppModel } from "./app-model";

export function ForgotPasswordRoute(props: { app: AppModel }) {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await apiPutUsersForgotPassword({
        query: {
          user_email: email,
        },
      });

      setSuccessMessage(
        "Password reset instructions have been sent to your email.",
      );
      setEmail("");
    } catch (error) {
      if (error instanceof RequestError) {
        if (error.response.status === 404) {
          setErrorMessage("No user found with this email address.");
        } else if (error.response.status === 405) {
          setErrorMessage(
            "Multiple accounts found with this email. Please contact support.",
          );
        } else {
          setErrorMessage("An error occurred. Please try again later.");
        }
      } else {
        throw error;
      }
    }
  };

  return (
    <div className="grow flex items-center justify-center">
      <div className="flex flex-col w-80">
        <h2 className="text-2xl font-semibold mb-6">Forgot password</h2>

        <Form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="grid grid-cols-[max-content_1fr] gap-x-2 gap-y-3 items-center">
            <label>Email address:</label>
            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              required
              autoFocus
            />
          </div>

          <ErrorMessage message={errorMessage} />
          <SuccessMessage message={successMessage} />

          <div className="flex items-center justify-between mt-6">
            <Link
              to="/login"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Back to login
            </Link>

            <Button type="submit">Send reset instructions</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
