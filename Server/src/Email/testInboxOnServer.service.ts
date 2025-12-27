import net from "node:net";

enum SMTPStageNames {
  CHECK_CONNECTION_ESTABLISHED = "CHECK_CONNECTION_ESTABLISHED",
  SEND_EHLO = "SEND_EHLO",
  SEND_MAIL_FROM = "SEND_MAIL_FROM",
  SEND_RECIPIENT_TO = "SEND_RECIPIENT_TO",
}

type TTypeInboxResult = {
  connection_succeeded: boolean;
  inbox_exists: boolean;
};

export const testInboxOnServer = async (
  smtpHostname: string,
  emailInbox: string
): Promise<TTypeInboxResult> => {
  return new Promise((resolve, reject) => {
    const result = {
      connection_succeeded: false,
      inbox_exists: false,
    };

    const socket = net.createConnection(25, smtpHostname);

    socket.setTimeout(4000);

    let currentStageName: SMTPStageNames =
      SMTPStageNames.CHECK_CONNECTION_ESTABLISHED;

    socket.on("timeout", () => {
      console.log("SMTP Timeout - Conexão lenta ou porta bloqueada.");
      socket.destroy();

      reject(new Error("SMTP Connection Timeout"));
    });

    socket.on("data", (data) => {
      const response = data.toString("utf-8");

      switch (currentStageName) {
        case SMTPStageNames.CHECK_CONNECTION_ESTABLISHED: {
          const expectedReplyCode = "220";
          const nextStageName = SMTPStageNames.SEND_EHLO;
          const command = "EHLO mail.example.org\r\n";

          if (!response.startsWith(expectedReplyCode)) {
            socket.end();
            return resolve(result);
          }

          result.connection_succeeded = true;

          socket.write(command, () => {
            currentStageName = nextStageName;
          });
          break;
        }

        case SMTPStageNames.SEND_EHLO: {
          const expectedReplyCode = "250";
          const nextStageName = SMTPStageNames.SEND_MAIL_FROM;
          const command = "MAIL FROM:<name@example.org>\r\n";

          if (!response.startsWith(expectedReplyCode)) {
            socket.end();
            return resolve(result);
          }

          socket.write(command, () => {
            currentStageName = nextStageName;
          });
          break;
        }

        case SMTPStageNames.SEND_MAIL_FROM: {
          const expectedReplyCode = "250";
          const nextStageName = SMTPStageNames.SEND_RECIPIENT_TO;
          const command = `RCPT TO:<${emailInbox}>\r\n`;

          if (!response.startsWith(expectedReplyCode)) {
            socket.end();
            return resolve(result);
          }

          socket.write(command, () => {
            currentStageName = nextStageName;
          });
          break;
        }

        case SMTPStageNames.SEND_RECIPIENT_TO: {
          const expectedReplyCode = "250";
          const command = "QUIT\r\n";

          if (response.startsWith(expectedReplyCode)) {
            result.inbox_exists = true;
          }

          socket.write(command, () => {
            socket.end();
            return resolve(result);
          });
        }
      }
    });

    socket.on("error", (err: Error) => {
      reject(err);
    });
  });
};
