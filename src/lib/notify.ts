import "server-only";

// Заявка с персональными данными уходит в Битрикс24 компании (серверы в РФ, 152-ФЗ).
// В Telegram — только уведомление без имени и телефона.

type CrmLead = {
  title: string;
  name: string;
  phone: string;
  comments: string;
};

export async function createCrmLead(lead: CrmLead): Promise<number | null> {
  const webhook = process.env.BITRIX24_WEBHOOK_URL;
  if (!webhook || !webhook.startsWith("https://")) return null;

  const res = await fetch(`${webhook.replace(/\/+$/, "")}/crm.lead.add.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: {
        TITLE: lead.title,
        NAME: lead.name,
        PHONE: [{ VALUE: lead.phone, VALUE_TYPE: "WORK" }],
        COMMENTS: lead.comments,
        SOURCE_ID: "WEB",
      },
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return null;
  const data: unknown = await res.json();
  const id = typeof data === "object" && data !== null && "result" in data ? Number(data.result) : NaN;
  return Number.isFinite(id) && id > 0 ? id : null;
}

export async function notifyTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
    signal: AbortSignal.timeout(8000),
  });
  return res.ok;
}
