import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    general: {
      back: 'Back',
      cards: '{count} card | {count} cards',
    },
    footer: {
      support: 'Any questions or feedback? Or did you find a problem or bug? Don\'t hesitate to contact us: {email}.',
    },
    landing: {
      title: 'Get your bitcoin',
      titlePreview: 'Preview – Get your bitcoin',
      introGreeting: 'Hey!',
      introMessageReceiveBtc: {
        message: 'You are just about to receive {amountAndUnit}',
        amountAndUnit: '{amount} bitcoin*',
        footnote: '* via Lightning',
      },
      introMessageAlreadyUsed: {
        headline: 'It seems that this QR code has already been used.',
        message: 'But don\'t worry: You can get your own bitcoin at a Crypto exchange (e.g. {exchange}) at a Bitcoin ATM (e.g. {atm}) or from a Crypto broker (e.g. {broker}) etc.',
      },
      introMessageJustReceived: {
        headline: 'Your QR code has just been used. {emoji}',
        message: 'You can get more bitcoin at a Crypto exchange (e.g. {exchange}) at a Bitcoin ATM (e.g. {atm}) or from a Crypto broker (e.g. {broker}) etc.',
      },
      sectionBitcoin: {
        paragraphs: {
          0: 'Bitcoin is a <strong>digital currency</strong>.',
          1: 'It is being managed by all members of the bitcoin network, which means it is <strong>not under control</strong> of any central bank, government, or company.',
          2: 'Transactions (including international ones) are as easy as scanning a QR code. Just give it a try!',
        },
      },
      sectionWallet: {
        headline: 'Download a wallet',
        explanation: 'To receive, store and spend your bitcoin, you need a <strong>Lightning wallet</strong>.<br>For every-day use and small amounts, a smartphone app is most convenient.',
        recommendation: 'For starters we recommend {walletOfSatoshi}.',
        button: 'Download Wallet of Satoshi',
        other: 'You can also try {wallet0}, {wallet1}, {wallet2} or any other Lightning wallet*.',
        otherFootnote: '* that understands Lightning and LNURL',
      },
      sectionReceive: {
        headline: 'Receive your bitcoin',
        statusNormal: {
          explanation: 'As soon as your wallet is installed,',
          step1: '<strong>tap</strong> the QR code below, or',
          step2: '<strong>scan</strong> the QR code on your tip card again<br>(using your wallet app)',
        },
        statusReceived: {
          congrats: 'Congrats!',
          message: 'The bitcoin were just transferred to your wallet.',
        },
      },
      sectionUse: {
        headline: 'Use your bitcoin',
        message: 'You can now spend your bitcoin at a store or on a website that accepts bitcoin, transfer them to your friend\'s or colleague\'s Lightning wallet, or just hodl* them.',
        messageFootnote: '* to hodl = to hold, to save up',
        examplesIntro: 'Here are a few websites where you can pay with bitcoin via Lightning:',
        examples: {
          saltNDaisy: 'Buy some sustainable granola',
          satoshistore: 'Shop Bitcoin Outfits',
          aprycotMedia: 'Bitcoin books, media and more',
          copiaro: 'Hardware Wallets & HODL tools',
          lightningnetworkstores: 'Find out what else you could do online',
          coinpages: 'Find stores that accept bitcoin',
        },
        createYourOwnTipCardsHeadline: 'Create your own Tip Cards',
        createYourOwnTipCardsText: 'Would you like to give your friends or colleagues a few Sats (1 Sat = 0.00000001 Bitcoin) or tip someone in Bitcoin? Click on the following button and configure your personal Tip Cards.',
        createYourOwnTipCardsButton: 'Create my own Tip Cards',
      },
    },
    funding: {
      title: 'Fund your Tip Card',
      headline: 'Fund this Tip Card',
      headlineFunded: 'Tip Card has been funded',
      headlineUsed: 'Tip Card successfully redeemed',
      text: 'This tip card has not been funded with sats yet. Specify the amount and the message you want the recipient to see in their wallet.',
      textFunded: 'This Tip Card is already funded with ({amountAndUnit}) and can be given to somebody who is in need of some orange pilling.',
      textUsed: 'This card was funded with {amountAndUnit} and has been redeemed.',
      amountAndUnit: '{amount} BTC',
      form: {
        textHint: 'will be displayed in the recipient\'s wallet',
        notePlaceholder: 'Notes / handed out to',
        noteHint: 'will be displayed on the status section of your Tip Cards set',
        button: 'Load card',
      },
      invoiceText: 'Fund your Tip Card with {amount} sats:',
      invoiceExpired: 'The lightning invoice for this card has expired. Please reset the Tip Card to continue.',
      resetInvoice: 'Reset Tip Card',
      resetDisabledTooltip: 'This card is already funded with sats.',
      lnurlp: {
        text: 'Scan the QR code with your wallet app or click "Open in wallet" to fund the card. You can enter the desired amount in the wallet app.',
      },
      lnurlpExpired: 'Unfortunately the payment link for this Tip Card expired. Reset the card to continue.',
      lnurlpFundedExpired: 'Unfortunately the payment link for this Tip Card expired. Complete the funding to continue.',
      shared: {
        text: 'Scan and pay the QR Code as many times as you want and "Complete Funding" as soon as you\'re done.',
        textEmpty: 'This Tip Card is still empty. As soon as there are some Sats on it you can complete the card.',
        textPartiallyFunded: 'This Tip Card is already funded with {amountAndUnit}. As soon as you complete the funding the Bitcoin can be withdrawn.',
        buttonFinish: 'Complete Funding',
        finishDisabledTooltip: 'You need to fund this card first.',
        buttonMakeShared: 'Activate shared funding on this Tip Card',
      },
    },
    index: {
      buttonCreate: 'Create your Tip Cards set ⚡',
      savedCardsSetsHeadline: 'Saved Tip Cards sets',
      noSavedCardsSetsMessage: 'No saved Tip Cards sets found in this browser',
      unnamedSetNameFallback: 'Unnamed set',
      youtube: {
        create: {
          label: 'Create',
          link: 'https://youtu.be/R6p7fUKu4MY',
        },
        use: {
          label: 'Use',
          link: 'https://youtu.be/bFeEPbupdx8',
        },
      },
    },
    cards: {
      title: 'Tip Cards Set',
      status: {
        headline: 'Status',
        noCards: 'No cards have been funded yet. You will find the status of all cards from this set here after funding your first Tip Card.',
        labelUsed: 'Redeemed',
        labelFunded: 'Funded',
        labelPendingFunding: 'Funding in progress',
        labelPendingSharedFunding: 'Shared funding in progress',
        labelNote: 'Note',
        labelViewed: 'Viewed by recipient',
        reload: 'Reload',
      },
      settings: {
        headline: 'Configuration',
        numberOfCards: 'Number of cards',
        cardHeadline: 'Card headline',
        cardText: 'Card text',
        cardQrCodeLogoLabel: 'Logo on QR codes',
        cardQrCodeLogo: {
          noLogo: 'No logo',
        },
        setName: 'Set name',
      },
      buttonSaveCardsSet: 'Save Tip Cards set',
      buttonDeleteCardsSet: 'Delete saved set',
      buttonPrint: 'Print Tip Cards',
      buttonDownloadPngs: 'Download PNGs',
      saveSetConfirm: 'The current Tip Cards set will be saved locally in this browser, using localStorage.\n\nYou can also use the URL (from the address bar) to access this Tip Cards set.\n\nContinue?',
      deleteSetConfirm: 'Do you really want to delete the current Tip Cards set and its settings from this browser?',
      filterLabel: 'Display cards:',
      filter: {
        all: 'All',
        unfunded: 'Unfunded',
        funded: 'Funded',
        used: 'Redeemed',
      },
    },
    lightningQrCode: {
      buttonOpenInWallet: 'Open in wallet',
      copyToClipboard: {
        lnurl: {
          beforeCopy: 'You can also {action} to paste it into your wallet app.',
          beforeCopyAction: 'copy the LNURL to your clipboard',
          afterCopySuccess: 'Copied successfully.',
          afterCopyNextStep: 'Paste it into<br>your wallet app now :)',
        },
        invoice: {
          beforeCopy: 'You can also {action} to paste it into your wallet app.',
          beforeCopyAction: 'copy the invoice to your clipboard',
          afterCopySuccess: 'Copied successfully.',
          afterCopyNextStep: 'Paste it into<br>your wallet app now :)',
        },
      },
    },
  },
  de: {
    general: {
      back: 'Zurück',
      cards: '{count} Karte | {count} Karten',
    },
    footer: {
      support: 'Hast du Fragen, Feedback, ein Problem oder einen Bug entdeckt? Schreib uns an {email}.',
    },
    landing: {
      title: 'Hol dir deine Bitcoin',
      titlePreview: 'Vorschau – Hol dir deine Bitcoin',
      introGreeting: 'Hi!',
      introMessageReceiveBtc: {
        message: 'Hier kannst du dir {amountAndUnit} holen*.',
        amountAndUnit: '{amount} Bitcoin',
        footnote: '* über Lightning',
      },
      introMessageAlreadyUsed: {
        headline: 'Dieser QR-Code wurde anscheinend bereits eingelöst.',
        message: 'Aber keine Sorge: Du kannst dir Bitcoin auch an einer Crypto-Börse (z.B. {exchange}), einem Bitcoin-Automaten (z.B. {atm}) oder bei einem Bitcoin-Broker (z.B. {broker}) etc. kaufen.',
      },
      introMessageJustReceived: {
        headline: 'Dein QR-Code wurde soeben eingelöst. {emoji}',
        message: 'Mehr Bitcoin kannst du dir an einer Crypto-Börse (wie {exchange}), einem Bitcoin-Automaten (z.B. von {atm}) oder bei einem Bitcoin-Broker (beispielsweise {broker}) etc. kaufen.',
      },
      sectionBitcoin: {
        paragraphs: {
          0: 'Bitcoin ist eine <strong>digitale Währung</strong>.',
          1: 'Sie wird von allen Teilnehmer:innen des Bitcoin-Netzwerks verwaltet, das bedeutet, sie ist <strong>nicht unter Kontrolle</strong> einer Zentralbank, Regierung oder eines Konzerns.',
          2: 'Überweisungen (auch internationale) sind so einfach wie das Scannen eines QR-Codes. Probier es einfach aus!',
        },
      },
      sectionWallet: {
        headline: 'Installiere eine Wallet',
        explanation: 'Um Bitcoin empfangen, speichern und ausgeben zu können, benötigst du eine <strong>Lightning-Wallet</strong>.<br>Für den alltäglichen Gebrauch und kleine Beträge ist eine Smartphone-App am bequemsten.',
        recommendation: 'Zum Einstieg empfehlen wir die {walletOfSatoshi}.',
        button: 'Wallet of Satoshi herunterladen',
        other: 'Du kannst auch {wallet0}, {wallet1}, {wallet2} ausprobieren oder irgendeine andere Wallet*.',
        otherFootnote: '* die mit Lightning und LNURL kompatibel ist',
      },
      sectionReceive: {
        headline: 'Hol dir deine Bitcoin',
        statusNormal: {
          explanation: 'Sobald deine Wallet installiert ist,',
          step1: '<strong>drücke</strong> auf den QR-Code unten oder',
          step2: '<strong>scanne</strong> den QR-Code auf deiner Tip Card erneut<br>(mit deiner Wallet-App)',
        },
        statusReceived: {
          congrats: 'Gratulation!',
          message: 'Die Bitcoin wurden soeben in deine Wallet übertragen.',
        },
      },
      sectionUse: {
        headline: 'Verwende deine Bitcoin',
        message: 'Du kannst mit deinen Bitcoin jetzt etwas in einem Geschäft oder auf einer Website, wo Bitcoin akzeptiert werden, kaufen. Oder du überweist sie in die Lightning Wallet eines Freundes oder einer Kollegin. Oder du hodlst* sie einfach.',
        messageFootnote: '* hodln = halten, sparen',
        examplesIntro: 'Hier sind ein paar Links auf Sites, auf denen du Bitcoin verwenden kannst:',
        examples: {
          saltNDaisy: 'Kauf dir nachhaltiges Granola',
          satoshistore: 'Shoppe stylishes Bitcoin-Outfit',
          aprycotMedia: 'Bücher, Medien & mehr zum Thema Bitcoin',
          copiaro: 'Hardware Wallets & HODL-Werkzeuge',
          lightningnetworkstores: 'Finde heraus, was du online machen kannst',
          coinpages: 'Such nach Geschäften, die Bitcoin akzeptieren',
        },
        createYourOwnTipCardsHeadline: 'Erstelle eigene Tip Cards ⚡',
        createYourOwnTipCardsText: 'Möchtest du deinen Freundinnen oder Bekannten ein paar Sats (1 Sat = 0,00000001 Bitcoin) schenken oder jemandem Trinkgeld in Form von Bitcoin geben? Klick auf den folgenden Button und konfiguriere deine persönlichen Tip Cards.',
        createYourOwnTipCardsButton: 'Meine eigenen Tip Cards erstellen',
      },
      sectionMore: {
        headline: 'Mehr über Bitcoin',
        text: 'Es gibt viele Möglichkeiten, mehr über Bitcoin zu erfahren.',
        bconf: {
          text: 'Die <strong>BTC23</strong> ist die größte Bitcoin-Konferenz im deutschsprachigen Raum und findet von 14. bis 17. September 2023 in Innsbruck (Österreich) statt. Mit dem Gutscheincode "<b>tipcards</b>" bekommst du 5% Rabatt auf dein Ticket.',
          linkLabel: 'Hol dir hier dein Ticket für die BTC23',
          linkHref: 'https://pretix.eu/btc/23/c/bPCDAshzq/',
        },
      },
    },
    funding: {
      title: 'Lade die Tip Card auf',
      headline: 'Lade die Tip Card auf',
      headlineFunded: 'Die Tip Card wurde aufgeladen',
      headlineUsed: 'Die Tip Card wurde eingelöst',
      text: 'Diese Tip Card wurde noch nicht mit Sats aufgeladen. Lege fest, welchen Betrag du aufladen möchtest und welche Nachricht der Empfänger in seiner Wallet sehen soll.',
      textFunded: 'Die Karte wurde mit {amountAndUnit} aufgeladen und kann weitergegeben werden.',
      textUsed: 'Die Karte wurde mit {amountAndUnit} aufgeladen und eingelöst.',
      amountAndUnit: '{amount} BTC',
      form: {
        textHint: 'wird in der Wallet des Empfängers angezeigt werden',
        notePlaceholder: 'Notizen / ausgegeben an',
        noteHint: 'wird im Statusbereich der Tip Cards Übersichtsseite angezeigt',
        button: 'Jetzt aufladen',
      },
      invoiceText: 'Lade {amount} Sats auf deine Tip Card:',
      invoiceExpired: 'Die Rechnung für diese Karte ist bereits abgelaufen. Setze die Tip Card zurück um fortzufahren.',
      resetInvoice: 'Tip Card zurücksetzen',
      resetDisabledTooltip: 'Diese Tip Card wurde bereits mit Sats aufgeladen.',
      lnurlp: {
        text: 'Zum Aufladen der Tip Card den QR Code mit der Wallet App scannen oder auf "In der Wallet öffnen" klicken und in der App den gewünschten Betrag eingeben.',
      },
      lnurlpExpired: 'Die Aufladefunktion dieser Tip Card ist leider abgelaufen. Setze sie zurück um fortzufahren.',
      lnurlpFundedExpired: 'Die Aufladefunktion dieser Tip Card ist leider abgelaufen. Schließe sie ab um fortzufahren.',
      shared: {
        text: 'Diese Tip Card kann gemeinsam von mehreren Personen aufgeladen werden. Den QR Code beliebig oft scannen/bezahlen und danach "Aufladen abschließen".',
        textEmpty: 'Derzeit befinden sich noch keine Sats auf der Karte. Sobald die Karte zumindest einmal aufgeladen wurde, kann das Aufladen abgeschlossen werden.',
        textPartiallyFunded: 'Die Karte wurde bereits mit {amountAndUnit} aufgeladen. Sobald du die Aufladung abschließt, können die Bitcoin abgeholt werden.',
        buttonFinish: 'Aufladen abschließen',
        finishDisabledTooltip: 'Die Karte muss zuerst aufgeladen werden.',
        buttonMakeShared: 'Tip Card gemeinsam aufladen',
      },
    },
    index: {
      buttonCreate: 'Erstelle dein Tip Cards-Set',
      savedCardsSetsHeadline: 'Gespeicherte Tip Cards-Sets',
      noSavedCardsSetsMessage: 'In diesem Browser sind derzeit keine Tip Cards-Sets gespeichert',
      unnamedSetNameFallback: 'Unbenanntes Set',
      youtube: {
        create: {
          label: 'Erstellen',
          link: 'https://www.youtube.com/watch?v=Oq__BT6oVoM',
        },
        use: {
          label: 'Verwenden',
          link: 'https://www.youtube.com/watch?v=26dj0580HYc',
        },
      },
    },
    cards: {
      title: 'Tip Cards-Set',
      status: {
        headline: 'Status',
        noCards: 'Es wurden noch keine Karten aufgeladen. Der Status der Karten dieses Sets wird hier angezeigt, sobald die erste Karte aufgeladen ist.',
        labelUsed: 'Eingelöst',
        labelFunded: 'Aufgeladen',
        labelPendingFunding: 'Wird aufgeladen',
        labelPendingSharedFunding: 'Wird gemeinsam aufgeladen',
        labelNote: 'Notiz',
        labelViewed: 'Wurde angesehen',
        reload: 'Aktualisieren',
      },
      settings: {
        headline: 'Konfiguration',
        numberOfCards: 'Anzahl',
        cardHeadline: 'Karten-Überschrift',
        cardText: 'Karten-Text',
        cardQrCodeLogoLabel: 'Logo auf den QR-Codes',
        cardQrCodeLogo: {
          noLogo: 'Kein Logo',
        },
        setName: 'Set-Name',
      },
      buttonSaveCardsSet: 'Set speichern',
      buttonDeleteCardsSet: 'Set löschen',
      buttonPrint: 'Tip Cards drucken',
      buttonDownloadPngs: 'PNGs downloaden',
      saveSetConfirm: 'Das aktuelle Tip Cards-Set wird lokal in diesem Browser gespeichert (dafür wird localStorage verwendet).\n\nDu kannst auch die URL (siehe Browser-Adressleiste) verwenden um später erneut auf dieses Tip Cards-Set zuzugreifen.\n\nMöchtest du speichern?',
      deleteSetConfirm: 'Möchtest du die Einstellungen des aktuellen Tip Cards-Sets wirklich aus dem Browser löschen?',
      filterLabel: 'Karten filtern:',
      filter: {
        all: 'Alle',
        unfunded: 'Nicht aufgeladen',
        funded: 'Aufgeladen',
        used: 'Eingelöst',
      },
    },
    lightningQrCode: {
      buttonOpenInWallet: 'In der Wallet öffnen',
      copyToClipboard: {
        lnurl: {
          beforeCopy: 'Du kannst {action} um sie in deiner Wallet einzufügen.',
          beforeCopyAction: 'die LNURL auch kopieren,',
          afterCopySuccess: 'Erfolgreich kopiert.',
          afterCopyNextStep: 'Füge sie jetzt<br>in deiner Wallet-App ein :)',
        },
        invoice: {
          beforeCopy: 'Du kannst {action} um sie in deiner Wallet einzufügen.',
          beforeCopyAction: 'die Rechnung auch kopieren,',
          afterCopySuccess: 'Erfolgreich kopiert.',
          afterCopyNextStep: 'Füge sie jetzt<br>in deiner Wallet-App ein :)',
        },
      },
    },
  },
  es: {
    general: {
      back: 'Atrás',
      cards: '{count} tarjeta | {count} tarjetas',
    },
    footer: {
      support: '¿Tienes preguntas, comentarios, un problema o encontraste un error? Escríbenos a {email}.',
    },
    landing: {
      title: 'Consigue tu Bitcoin',
      titlePreview: 'Vista previa – Consigue tu Bitcoin',
      introGreeting: '¡Hola!',
      introMessageReceiveBtc: {
        message: 'Puedes obtener {amountAndUnit} aquí*.',
        amountAndUnit: '{amount} Bitcoin',
        footnote: '* con Lightning',
      },
      introMessageAlreadyUsed: {
        headline: 'Al parecer, este código QR ya ha sido canjeado.',
        message: 'Pero no te preocupes: también puedes comprar Bitcoin en un criptointercambio (por ejemplo, {exchange}), una máquina de Bitcoin (por ejemplo, {atm}) o un broker de Bitcoin (por ejemplo, {broker}), etc.',
      },
      introMessageJustReceived: {
        headline: 'Tu código QR acaba de ser canjeado. {emoji}',
        message: 'Puedes comprar más Bitcoin en un criptointercambio (como {exchange}), en una máquina de Bitcoin (por ejemplo de {atm}) o en un broker de Bitcoin (por ejemplo {broker}).',
      },
      sectionBitcoin: {
        paragraphs: {
          0: 'Bitcoin es una <strong>moneda digital</strong>.',
          1: 'Está gestionado por todos los participantes de la red Bitcoin, lo que significa que <strong>no está bajo el control</strong> de un banco central, gobierno o corporación.',
          2: 'Transferir dinero (incluso a nivel internacional) es tan fácil como escanear un código QR. Pruébalo.',
        },
      },
      sectionWallet: {
        headline: 'Instala una cartera',
        explanation: 'Para poder recibir, almacenar y gastar bitcoin, se necesita un <strong>monedero Lightning<strong>.<br>Para el uso cotidiano y las pequeñas cantidades, lo más cómodo es una aplicación para smartphone.',
        recommendation: 'Para empezar, recomendamos el {walletOfSatoshi}.',
        button: 'Descargar Wallet of Satoshi',
        other: 'También puedes probar con {wallet0}, {wallet1}, {wallet2} o cualquier otra cartera.*.',
        otherFootnote: '* que es compatible con Lightning y LNURL',
      },
      sectionReceive: {
        headline: 'Consigue tu Bitcoin',
        statusNormal: {
          explanation: 'Una vez instalada la cartera,',
          step1: '<strong>haz clic</strong> en el código QR de abajo, o',
          step2: '<strong>escanea</strong> el código QR de tu tarjeta de propinas de nuevo<br>(con tu aplicación wallet).',
        },
        statusReceived: {
          congrats: '¡Felicicades!',
          message: 'Los Bitcoin acaban de ser transferidos a tu cartera.',
        },
      },
      sectionUse: {
        headline: 'Utiliza tus Bitcoin',
        message: 'Ahora puedes comprar algo con tus Bitcoin en una tienda o en un sitio web donde se acepte Bitcoin. O puedes transferirlos a la Lightning Wallet de un amigo o colega. O puedes simplemente guardarlos*.',
        messageFootnote: '* hodln = mantener, guardar',
        examplesIntro: 'Aquí hay algunos enlaces a sitios donde puede usar Bitcoin:',
        examples: {
          saltNDaisy: 'Compra granola sostenible',
          satoshistore: 'Compra ropa Bitcoin de moda',
          aprycotMedia: 'Libros de Bitcoin, medios de comunicación y más',
          copiaro: 'Carteras de hardware y herramientas HODL',
          lightningnetworkstores: 'Descubre lo que puedes hacer online',
          coinpages: 'Busca tiendas que acepten Bitcoin',
        },
        createYourOwnTipCardsHeadline: 'Crea tus propias tarjetas de propina ⚡',
        createYourOwnTipCardsText: '¿Quieres regalar a tus amigos o conocidos unos sats (1 Sat = 0,00000001 Bitcoin) o dar a alguien una propina en forma de Bitcoin? Haz clic en el siguiente botón y configura tus tarjetas de propina personales.',
        createYourOwnTipCardsButton: 'Crear mis propias tarjetas de propinas',
      },
    },
    funding: {
      title: 'Cargar la tarjeta de propinas',
      headline: 'Cargar la tarjeta de propinas',
      headlineFunded: 'Tip Card has been funded',
      headlineUsed: 'Tip Card successfully redeemed',
      text: 'Esta tarjeta de propina aún no ha sido recargada con sats. Estableze la cantidad que deseas recargar y el mensaje que quieres que el destinatario vea en su cartera.',
      textFunded: 'La tarjeta está cargada con {amountAndUnit} y está lista para regalar.',
      textUsed: 'This card was funded with {amountAndUnit} and has been redeemed.',
      amountAndUnit: '{amount} BTC',
      form: {
        textHint: 'aparecerá en la cartera del destinatario',
        notePlaceholder: 'Notes / handed out to',
        noteHint: 'will be displayed on the status section of your Tip Cards set',
        button: 'Recargar ahora',
      },
      invoiceText: 'Carga {cantidad} de sats en tu tarjeta de propinas:',
      invoiceExpired: 'The lightning invoice for this card has expired. Please reset the Tip Card to continue.',
      resetInvoice: 'Reset Tip Card',
      resetDisabledTooltip: 'This card is already funded with sats.',
      lnurlp: {
        text: 'Scan the QR code with your wallet app or click "Open in wallet" to fund the card. You can enter the desired amount in the wallet app.',
      },
      lnurlpExpired: 'Unfortunately the payment link for this Tip Card expired. Reset the card to continue.',
      lnurlpFundedExpired: 'Unfortunately the payment link for this Tip Card expired. Complete the funding to continue.',
      shared: {
        text: 'Es posible cargar esta tarjeta de propina varias veces. Escanea el código QR varias veces/paga y luego haz clic en "Finalizar carga"',
        textEmpty: 'En el momento no hay Sats en la tarjeta. En cuanto la tarjeta esté cargada por lo menos una vez se puede finalizar la carga.',
        textPartiallyFunded: 'La tarjeta fue cargada con {amountAndUnit}. En cuanto finalices la carga es posible recoger los Bitcoin.',
        buttonFinish: 'Finalizar carga',
        buttonMakeShared: 'Carga de la tarjeta de propina juntos',
      },
    },
    index: {
      buttonCreate: 'Crea tu conjunto de tarjetas de propina',
      savedCardsSetsHeadline: 'Juegos de tarjetas de consejos guardados',
      noSavedCardsSetsMessage: 'Actualmente no hay conjuntos de Tip Cards almacenados en este navegador',
      youtube: {
        create: {
          label: 'Crear',
          link: 'https://youtu.be/6PNTu6IDBmc',
        },
        use: {
          label: 'Usar',
          link: 'https://youtu.be/cGWwuuhmtXk',
        },
      },
    },
    cards: {
      title: 'Conjunto de tarjetas de propina',
      status: {
        labelUsed: 'Canjeada | Canjeadas',
        labelFunded: 'Cargada | Cargadas',
      },
      settings: {
        numberOfCards: 'Número',
        cardHeadline: 'Título de la tarjeta',
        cardText: 'Texto de la tarjeta',
        cardQrCodeLogoLabel: 'Logo en los códigos QR',
        cardQrCodeLogo: {
          noLogo: 'Sin logo',
        },
      },
      buttonSaveCardsSet: 'Guardar juego de tarjetas de propina',
      buttonDeleteCardsSet: 'Borrar juego',
      buttonPrint: 'Imprimir tarjetas de propina',
      buttonDownloadPngs: 'Bajar PNGs',
      saveSetConfirm: 'El conjunto actual de tarjetas de consejos se almacena localmente en este navegador (se utiliza localStorage para ello). También puedes utilizar la URL (véase la barra de direcciones del navegador) para acceder de nuevo a este conjunto de tarjetas de consejos más adelante. ¿Deseas guardar?',
      deleteSetConfirm: '¿Realmente quieres eliminar la configuración del conjunto de tarjetas de consejos actual del navegador?',
      filterLabel: 'Filtro de tarjetas:',
      filter: {
        all: 'Todas',
        unfunded: 'Sin cargo',
        funded: 'Cargadas',
        used: 'Canjeadas',
      },
    },
    lightningQrCode: {
      buttonOpenInWallet: 'Abrir en la cartera',
      copyToClipboard: {
        lnurl: {
          beforeCopy: 'Puedes {actuar} para añadirlos a tu cartera.',
          beforeCopyAction: 'También copiar LNURL.',
          afterCopySuccess: 'Copiado con éxito.',
          afterCopyNextStep: 'Añádalos ahora<br>en tu aplicación de cartera :)',
        },
        invoice: {
          beforeCopy: 'Puedes {actuar} para añadirlos a tu cartera.',
          beforeCopyAction: 'también copiar la factura',
          afterCopySuccess: 'Copiado con éxito.',
          afterCopyNextStep: 'Añádalos ahora<br>en tu aplicación de cartera :)',
        },
      },
    },
  },
  he: {
    general: {
      back: 'חזרה',
      cards: 'כרטיס אחד | {count} כרטיסים',
    },
    footer: {
      support: 'יש שאלות, הערות והארות? מצאת בעיה או באג? אל תהסס/י ליצור קשר: {email}',
    },
    landing: {
      introGreeting: 'היי!',
      introMessageReceiveBtc: {
        message: 'את/ה עומד/ת לקבל {amountAndUnit}',
        amountAndUnit: '{amount} ביטקוין*',
        footnote: '* דרך לייטנינג',
      },
      introMessageAlreadyUsed: {
        headline: 'נראה שכבר נעשה שימוש בקוד ה-QR הזה.',
        message: 'אל דאגה: את/ה יכול/ה לקנות לך ביטקוין בבורסת קריפטו (לדוגמא {exchange}), בכספומט ביטקוין (לדוגמא {atm}), מחלפן קריפטו (לדוגמא {broker}) וכו\'.',
      },
      introMessageJustReceived: {
        headline: 'כרגע השתמשו בקוד ה-QR שלך. {emoji}',
        message: 'את/ה יכול/ה לקנות לך ביטקוין בבורסת קריפטו (לדוגמא {exchange}), בכספומט ביטקוין (לדוגמא {atm}), מחלפן קריפטו (לדוגמא {broker}) וכו\'.',
      },
      sectionBitcoin: {
        paragraphs: {
          0: 'ביטקוין הוא <strong>מטבע דיגיטלי</strong>.',
          1: 'הוא מנוהל ע"י כל החברים ברשת הביטקוין, כלומר הוא <strong>לא תחת שליטה</strong> של אף בנק מרכזי, ממשלה או תאגיד.',
          2: 'קל מאוד לשלוח ביטקוין (כולל העברות בינלאומיות) באמצעות סריקת קוד QR. נסו בעצמכם!',
        },
      },
      sectionWallet: {
        headline: 'התקנת ארנק',
        explanation: 'על מנת לקבל, לשמור ולהוציא את הביטקוין שלך, עליך להתקין <strong>ארנק ביטקוין</strong>.<br>לכמויות קטנות וימיומיות, אפליקצייה בסמארטפון היא הכי נוחה.',
        recommendation: 'למתחילים, אנו ממליצים להשתמש ב-{walletOfSatoshi}',
        button: 'להורדת Wallet of Satoshi',
        other: 'את/ה יכול/ה לנסות גם את {wallet0}, {wallet1}, {wallet2} או כל ארנק לייטנינג*.',
        otherFootnote: '* ארנק ביטקוין שתומך בלייטנינג וב-LNURL',
      },
      sectionReceive: {
        headline: 'קבלת הביטקוין שלך',
        statusNormal: {
          explanation: 'לאחר התקנת הארנק:',
          step1: '<strong>לחצ/י</strong> על קוד ה-QR, או',
          step2: '<strong>סרוק/סרקי</strong> את קוד ה-QR בכרטיס הטיפ שוב<br>(באמצעות אפליקציית הארנק)',
        },
        statusReceived: {
          congrats: 'מזל טוב!',
          message: 'הביטקוין הועבר לארנק שלך.',
        },
      },
      sectionUse: {
        headline: 'השתמש/י בביטקוין שלך',
        message: 'כעת את/ה יכול/ה להשתמש בביטקוין שלך בחנויות ואתרים שמקבלים ביטקוין, לשלוח אותו לארנקי לייטנינג של חברים, או סתם להדל*.',
        messageFootnote: '* להדל = to hold, to save up',
        examplesIntro: 'הנה מספר דוגמאות לאתרים שבהם ניתן לשלם עם ביטקוין דרך לייטנינג:',
        examples: {
          saltNDaisy: 'קנו גרנולה בת-קיימה',
          satoshistore: 'קנו בגדים בביטקוין',
          aprycotMedia: 'ספרים על ביטקוין, סרטונים ועוד',
          copiaro: 'ארנקי חומרה ושמירת ביטקוין לטווח ארוך',
          lightningnetworkstores: 'מצא/י מה עוד ניתן לקנות באינטרנט',
          coinpages: 'מצא חנויות שמקבלות ביטקוין',
        },
        createYourOwnTipCardsHeadline: 'צור/צרי את כרטיסי הטיפ שלך',
        createYourOwnTipCardsText: 'רוצה לתת לחברים כמה סטושים (1 סטושי = 0.00000001 ביטקוין) או לתת טיפ בביטקוין? לחצ/י על הכפתור מטה והגדר/י את כרטיסי הטיפ האישיים שלך.',
        createYourOwnTipCardsButton: 'צור את כרטיסי הטיפ שלי',
      },
    },
    funding: {
      headline: 'הטענת כרטיס הטיפ',
      text: 'כרטיס טיפ זה לא נטען עדיין באף סטושי. ציין/י את כמות הסטושים ואת ההודעה שמקבל/ת הכרטיס יראה/תראה בארנק שלו/ה.',
      form: {
        textHint: 'יוצג בארנק של מקבל/ת הכרטיס',
        notePlaceholder: 'הערות',
        noteHint: 'יוצגו בעמוד הסטטוס של קבוצת כרטיסי הטיפ שלך.',
        button: 'הטען כרטיס',
      },
      invoiceText: 'טען את כרטיס הטיפ שלך ב-{amount} סטושים:',
      invoiceExpired: 'קבלת הלייטנינג עבור כרטיס זה פקעה. יש לאתחל את כרטיס הטיפ כדי להמשיך.',
      resetInvoice: 'אתחל כרטיס טיפ',
      lnurlp: {
        text: 'סרוק/סרקי את קוד ה-QR עם אפליקציית הארנק, או לחצ/י "פתח בארנק" להטענת הכרטיס. ניתן לבחור את הכמות הרצויה להטענה באפליקציית הארנק.',
        textFunded: 'כרטיס טיפ זה כבר נטען ב-({amountAndUnit}) וניתן למסור אותו למישהו/י שצריכ/ה את "הגלולה הכתומה".',
        amountAndUnit: '{amount} ביטקוין',
      },
      lnurlpExpired: 'לצערנו פקע לינק התשלום לכרטיס הטיפ. אנא אתחל/י את הכרטיס כדי להמשיך.',
      lnurlpFundedExpired: 'לצערנו פקע לינק התשלום לכרטיס הטיפ. אנא סיימ/י את טעינת הכרטיס כדי להמשיך.',
      shared: {
        text: 'סרוק/סרקי ושלמ/י את קוד ה-QR כמה פעמים שתבחר/י, ולחצ/י על "סיים הטענה" כשסיימת.',
        textFunded: 'כרטיס טיפ זה טעון ב-({amountAndUnit}) וניתן למסור אותו למישהו/י שצריכ/ה את "הגלולה הכתומה".',
        textEmpty: 'כרטיס טיפ זה עדיין ריק. לאחר שייטען בכמה סטושים תוכל/י לסיים את התהליך.',
        textPartiallyFunded: 'כרטיס טיפ זה טעון ב-{amountAndUnit}. כשתסיימ/י את ההטענה יהיה ניתן למשוך את הביטקוין.',
        amountAndUnit: '{amount} ביטקוין',
        buttonFinish: 'סיים הטענה',
        buttonMakeShared: 'הפעל הטענה משותפת בכרטיס טיפ זה',
      },
    },
    index: {
      buttonCreate: 'צור/צרי את כרטיסי הטיפ שלך ⚡',
      savedCardsSetsHeadline: 'כרטיסי טיפ שמורים',
      noSavedCardsSetsMessage: 'לא נמצאו בדפדפן שלך אף כרטיסי טיפ שמורים',
      unnamedSetNameFallback: 'ללא שם',
      youtube: {
        create: {
          label: 'Create',
          link: 'https://youtu.be/R6p7fUKu4MY',
        },
        use: {
          label: 'Use',
          link: 'https://youtu.be/bFeEPbupdx8',
        },
      },
    },
    cards: {
      status: {
        headline: 'סטטוס',
        noCards: 'אף כרטיס לא הוטען עדיין. תוכל/י לראות את הסטטוס של הכרטיסים בקבוצה זו כאן, לאחר שתטענ/י את אחד מהם.',
        labelUsed: 'נוצל',
        labelFunded: 'הוטען',
        labelPendingFunding: 'הטענה מתבצעת כרגע',
        labelPendingSharedFunding: 'הטענה משותפת מתבצעת כרגע',
        labelNote: 'הערה',
        reload: 'Reload',
      },
      settings: {
        headline: 'הגדרות',
        numberOfCards: 'מספר הכרטיסים',
        cardHeadline: 'כותרת כרטיס',
        cardText: 'תיאור כרטיס',
        cardQrCodeLogoLabel: 'לוגו שיופיע על פני קוד ה-QR',
        cardQrCodeLogo: {
          noLogo: 'ללא לוגו',
        },
        setName: 'שם קבוצת כרטיסים',
      },
      buttonSaveCardsSet: 'שמור קבוצת כרטיסים',
      buttonDeleteCardsSet: 'מחק קבוצת כרטיסים',
      buttonPrint: 'הדפס קבוצת כרטיסים',
      buttonDownloadPngs: 'הורדת PNGים',
      saveSetConfirm: 'קבוצת הכרטיסים הנוכחית תשמר בזכרון המקומי של הדפדפן.\n\nניתן להשתמש גם בשורת הכתובת של עמוד זה כדי לגשת לקבוצת כרטיסי הטיפ הנוכחית.\n\nלהמשיך?',
      deleteSetConfirm: 'האם את/ה בטוח/ה שברצונך למחוק את קבוצת הכרטיסים הנוכחית מהזכרון של הדפדפן?',
      filterLabel: 'תצוגת כרטיסים:',
      filter: {
        all: 'כל הכרטיסים',
        unfunded: 'לא הוטענו',
        funded: 'הוטענו',
        used: 'נוצלו',
      },
    },
    lightningQrCode: {
      buttonOpenInWallet: 'פתח בארנק',
      copyToClipboard: {
        lnurl: {
          beforeCopy: 'ניתן גם {action} כדי להדביק אותו באפליקציית הארנק שלך.',
          beforeCopyAction: 'להעתיק את ה-LNURL ל-clipboard',
          afterCopySuccess: 'העתקה בוצעה בהצלחה.',
          afterCopyNextStep: 'הדבק/י אותו<br>באפליקציית הארנק שלך :)',
        },
        invoice: {
          beforeCopy: 'ניתן גם {action} כדי להדביק אותה באפליקציית הארנק שלך.',
          beforeCopyAction: 'להעתיק את החשבונית ל-clipboard',
          afterCopySuccess: 'העתקה בוצעה בהצלחה.',
          afterCopyNextStep: 'הדבק/י אותה<br>באפליקציית הארנק שלך :)',
        },
      },
    },
  },
}

const getPreferredLocale = () => {
  for (const lang of navigator.languages) {
    if (Object.keys(messages).includes(lang)) {
      return lang
    }
    const langShort = lang.split('-')[0]
    if (Object.keys(messages).includes(langShort)) {
      return langShort
    }
  }
}

const i18n = createI18n({
  legacy: false,
  allowComposition: true,
  locale: getPreferredLocale(),
  fallbackLocale: 'en',
  messages,
})

export default i18n
