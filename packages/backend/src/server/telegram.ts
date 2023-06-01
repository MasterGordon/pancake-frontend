const telegramApiKey = process.env.TELEGRAM_API_KEY
const telegramChatId = process.env.TELEGRAM_CHAT_ID

export const sendTelegramMessage = async (message: string) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(message)
    return
  }
  const url = new URL(`https://api.telegram.org/${telegramApiKey}/sendMessage`)
  url.searchParams.set('chat_id', telegramChatId!)
  url.searchParams.set('text', message)
  url.searchParams.set('parse_mode', 'Markdown')
  await fetch(url)
}
