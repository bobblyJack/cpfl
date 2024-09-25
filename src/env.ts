const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
export default {
    dev: mode === 'development',
    site: new URL(`https://${
        mode === 'development' 
        // dev host
        ? "localhost:3000"
        // prod host 
        : "green-field-0ab7dc600.5.azurestaticapps.net"
    }`),
    // client app guid
    client: "8ca8fd63-8fd6-4414-92e4-21584ed8df0f",
    // tenant guid
    tenant: "e72b34cf-ef52-473c-816a-e1d7d416dcc4",
    // taskpane drive reference
    drive: "b!sZigh2uhLkm81En6bkEH0c-dYK-8B61EljQC5ygtekif7QwnUqswTLKnsBFEkAKV"
}