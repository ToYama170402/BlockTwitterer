import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://twitter.com/*", "https://x.com/*"],
  all_frames: true
}

function waitForElement(selector: string, timeout = 10000): Promise<Element> {
  return new Promise((resolve, reject) => {
    // 既に要素が存在する場合はすぐに解決
    const element = document.querySelector(selector)
    if (element) {
      return resolve(element)
    }

    // タイムアウトの設定
    const timeoutId = setTimeout(() => {
      observer.disconnect()
      reject(
        new Error(
          `${selector} の要素が ${timeout}ms 以内に見つかりませんでした`
        )
      )
    }, timeout)

    // 要素の出現を監視
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector)
      if (element) {
        observer.disconnect()
        clearTimeout(timeoutId)
        resolve(element)
      }
    })

    // body全体の変更を監視
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  })
}

function checkText(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword))
}

async function checkTimeLine(tweetNodes: NodeList) {
  Array.from(tweetNodes)
    .filter(
      (node) =>
        node instanceof Element &&
        node.getAttribute("data-testid") === "cellInnerDiv"
    )
    .forEach(async (node: Element) => {
      const tweetTextElements = node.querySelector("[data-testid='tweetText']")
      if (
        tweetTextElements instanceof HTMLElement &&
        checkText(tweetTextElements.innerText, ["人工地震"])
      ) {
        await waitForElement("[aria-label='もっと見る']")
        const seeMoreButtonElement = node.querySelector(
          "[aria-label='もっと見る']"
        ) as HTMLButtonElement
        seeMoreButtonElement.click()

        await waitForElement("[data-testid='Dropdown']")
        const blockUserButtonElement = document.querySelector(
          "[data-testid='Dropdown']>[data-testid='block']"
        ) as HTMLButtonElement
        blockUserButtonElement.click()

        await waitForElement("[data-testid='confirmationSheetDialog']")
        const confirmBlockDialogElement = document.querySelector(
          "[data-testid='confirmationSheetDialog']"
        ) as HTMLElement

        console.log(
          "Confirm block dialog element found:",
          confirmBlockDialogElement
        )

        const confirmBlockButtonElement =
          confirmBlockDialogElement.querySelector(
            "[data-testid='confirmationSheetConfirm']"
          ) as HTMLButtonElement

        const confirmBlockHeadingText = (
          confirmBlockDialogElement.querySelector(
            "[role='heading']"
          ) as HTMLElement
        ).innerText.replace(/(@.*)さんをブロックしますか？/g, "$1")
        console.log(confirmBlockHeadingText)
        confirmBlockButtonElement.click()
        console.warn(
          `User ${confirmBlockHeadingText} has been blocked successfully.`
        )
        // alert("Block user button clicked")
      }
    })
}

async function main() {
  const observer = new MutationObserver((mutations) => {
    // console.log("MutationObserver triggered")
    mutations
      .filter(
        (mutation) =>
          mutation.type === "childList" && mutation.addedNodes.length > 0
      )
      .map((mutation) => checkTimeLine(mutation.addedNodes))
  })

  const timelineElement = document
  console.log("Timeline element found:", timelineElement)
  observer.observe(timelineElement, {
    childList: true,
    subtree: true
  })
}

main()
console.log("Twitter/X content script loaded")
