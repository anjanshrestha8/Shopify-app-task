import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import db from "../db.server";

import { getDestinationUrl } from "../models/QRCode.server";

export const loader = async ({ params }) => {
  // Validate the QR code ID
  invariant(params.id, "Could not find QR code destination");

  const id = Number(params.id);
  const qrCode = await db.qRCode.findFirst({ where: { id } });

  invariant(qrCode, "Could not find QR code destination");
  // Increment the scan count
  await db.qRCode.update({
    where: { id },
    data: { scans: { increment: 1 } },
  });
  // Redirect
  return redirect(getDestinationUrl(qrCode));
};
