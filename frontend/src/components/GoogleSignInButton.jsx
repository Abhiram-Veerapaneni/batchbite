import { GoogleLogin } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleSignInButton({
    onSuccess,
    onError,
    text = "continue_with"
}) {
    if (!GOOGLE_CLIENT_ID) {
        return (
            <div
                style={{
                    padding: "12px",
                    borderRadius: "10px",
                    background: "#fffbeb",
                    color: "#92400e",
                    fontSize: "0.85rem",
                    textAlign: "center",
                    border: "1px dashed #f59e0b"
                }}
            >
                <strong>Google Client Sign-In:</strong> Set <code>VITE_GOOGLE_CLIENT_ID</code> in <code>frontend/.env</code> to enable.
            </div>
        );
    }

    return (
        <div
            className="google-btn-wrapper"
            style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                minHeight: "40px"
            }}
        >
            <GoogleLogin
                onSuccess={(credentialResponse) => {
                    if (credentialResponse?.credential) {
                        onSuccess(credentialResponse.credential);
                    } else {
                        onError?.("No credential received from Google");
                    }
                }}
                onError={() => {
                    onError?.("Google sign-in was unsuccessful. Please try again.");
                }}
                text={text}
                shape="rectangular"
                size="large"
                theme="outline"
                width="100%"
            />
        </div>
    );
}

