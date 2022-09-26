const { expect } = require('chai')
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens 

describe('RealEstate', () => {
    let RealEstate, escrow
    let deployer, seller
    let nftID = 1
    let purchasePrice = ether(100)
    let escrowAmount = ether(20)

    //Load Contracts

    beforeEach(async () => {
        //Setup Accounts
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        seller = deployer
        buyer = accounts[1]
        inspector = accounts[2]
        lender = accounts[3]
       
        const RealEstate = await ethers.getContractFactory('RealEstate')
        const Escrow = await ethers.getContractFactory('Escrow')
    
    //Deploy Contracts
     realEstate = await RealEstate.deploy()
     escrow = await Escrow.deploy(
        RealEstate.Address,
        nftID,
        purchasePrice,
        escrowAmount,
        seller.address,
        buyer.address,
        inspector.address,
        lender.address
)

    //seller approves NFT
 transaction = await RealEstate.connect(seller).approve(escrow.address, nftID)
 await transaction.wait()

    })

    describe('Deployment', async () => {

        it("sends an Nft to the seller / deployer", (async () => {
            expect(await RealEstate.ownerOf(nftID)).to.equal(seller.address)

        })
    ,)
})
    
    describe('Selling real estate', async () => {

    let balance, transaction


        it('executes a successful transaction', async () => {
           //expects seller to be NFT owner before the sale 
         expect( await RealEstate.ownerOf(nftID).to.equal(seller.address))
//buyer deposits earnest
    transaction = await escrow.connect(buyer).depositEarnest({ value: ether(20) }) 
      // check escrow balance
      balance = await escrow .getBalance()
      console.log("escrow balance:", ethers.utils.formatEther(balance)); 
      
      //Inspector updates status
      transaction = await escrow.connect(inspector).updateInspectionStatus(true)
            await transaction.wait()
            console.log("Inspector updates status")

            //Buyer Approves Sale
            transaction = await escrow.connect(buyer).approveSale()
            await transaction.wait()
            console.log("Buyer approves sale")

            // Seller Approves Sale
            transaction = await escrow.connect(seller).approveSale()
            await transaction.wait()
            console.log("Seller approves sale")

            // Lender Funds the sale 
            transaction = await lender.sendTransaction({ to: escrow.address, value: ether(80) })
            await transaction.wait()
            console.log("Buyer approves sale")

            // Lender Approves Sale
            transaction = await escrow.connect(lender).approveSale()
            await transaction.wait()
            console.log("Lender approves sale")
    
    //finalize sale 
         transaction = await escrow.connect(buyer).finalizeSale()
         await transaction.wait()
        console.log("Buyer finalizes sale")

          //expects seller to be NFT owner after the sale 
          expect( await RealEstate.ownerOf(nftID).to.equal(buyer.address))
          
          //Expect Seller to receive funds

        balance = await ethers.provider.getBalance(seller.address)
        console.log("Seller Balance:", ethers.utils.formatEther(balance))
            expect(balance).to.be.above(ether(10099))
        

})
})
})
