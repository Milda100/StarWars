type MessageProps = {
  message?: string;
};

export const LoadingScreen = ({ message = "Loading movies..." }: MessageProps) => (
    <div
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
        <p className="mt-3">{message}</p>
        </div>
);

export const ErrorMessage = ({ message = "Error" }: MessageProps) => (
  <p className="text-danger text-align-center">{message}</p>
);

export const NotFound = ({ message = "Not Found" }: MessageProps) => (
  <p className="text-muted text-align-center">{message}</p>
);



