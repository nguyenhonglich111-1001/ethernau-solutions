fromB = 10
toB = 10
contractToB = 100
contractFromB = 100

import time
transferValue = 10
while fromB > 0:

    if transferValue > fromB:
        transferValue = fromB
    transferTo = int(transferValue*contractToB/contractFromB)
    print(fromB,'->',toB,'/',transferTo,'/',contractFromB,contractToB)
    
    if contractToB - transferTo < 0:
        break
    fromB -= transferValue
    toB += transferTo
    contractFromB += transferValue

    
    contractToB -= transferTo

    fromB,toB =toB,fromB
    contractToB,contractFromB = contractFromB,contractToB
    transferValue = fromB - 1


print(fromB,toB)
print(contractFromB,contractToB)

