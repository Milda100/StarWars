type MessageProps = {
  message?: string;
};

export const LoadingScreen = ({ message = "Loading..." }: MessageProps) => (
    <div
        id="loading-screen"
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: '100vh' }}
        >
        <img
            className="img-fluid"
            srcSet="https://mir-s3-cdn-cf.behance.net/project_modules/disp/82fbbf68040289.5b4f2400147bc.gif 600w, https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/82fbbf68040289.5b4f2400147bc.gif 628w"
            sizes="(max-width: 200px) 100vw, 628px"
            alt="darth vader"
            style={{ width: '150px', height: '150px' }}
        />
        <p className="mt-3 feedback-loading">{message}</p>
        </div>
);

export const ErrorMessage = ({ message = "Error" }: MessageProps) => (
  <div className="d-flex justify-content-center align-items-center vh-100">
    <h1 className="text-center feedback-error">{message}</h1>
  </div>
);


export const NotFound = ({ message = "Not Found" }: MessageProps) => (
  <div className="d-flex justify-content-center align-items-center vh-100">
    <h1 className="text-center feedback-notfound">{message}</h1>
  </div>
);



