const Tx = require('./index.js')
const tape = require('tape')
const ethUtil = require('ethereumjs-util')
const testing = require('ethereumjs-testing')

const forkNames = [
  'Byzantium',
  'Constantinople',
  'EIP150',
  'EIP158',
  'Frontier',
  'Homestead'
]

tape('TransactionTests', (t) => {
  testing.getTests('TransactionTests', (testName, testData) => {
    let rawTx
    let tx
    t.test(`${testName}: creates tx`, (st) => {
      try {
        rawTx = ethUtil.toBuffer(testData.rlp)
        tx = new Tx(rawTx)
        if (Object.keys(testData.Homestead).length === 0) {
          tx._homestead = false
        }
      } catch (e) {
        st.equal(undefined, tx, 'should not have any fields ')
        st.end()
      }
    })

    let sender
    let hash
    t.test(`${testName}: tx has correct data`, (st) => {
      if (tx && tx.validate()) {
        sender = tx.getSenderAddress().toString('hex')
        hash = tx.hash().toString('hex')
        try {
          forkNames.forEach(forkName => {
            st.equal(testData[forkName].sender, sender)
            st.equal(testData[forkName].hash, hash)
          })
        } catch (e) {
          st.fail(e)
        }
      } else {
        st.equal(undefined, tx, 'no tx params in test')
      }
      st.end()
    })
  })
  .then(() => {
    t.end()
  })
})
