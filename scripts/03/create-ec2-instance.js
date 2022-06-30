// Imports
const {
    EC2Client,
    AuthorizeSecurityGroupIngressCommand,
    CreateKeyPairCommand,
    CreateSecurityGroupCommand,
    RunInstancesCommand,
} = require('@aws-sdk/client-ec2')
const helpers = require('./helpers')

function sendCommand(command) {
    const client = new EC2Client({region: process.env.AWS_REGION})
    return client.send(command)
}

// Declare local variables
const sgName = 'hamster_sg'
const keyName = 'hamster_key'

// Do all the things together
async function execute() {
    try {
        // await createSecurityGroup(sgName)
        const keyPair = await createKeyPair(keyName)
        await helpers.persistKeyPair(keyPair)
        const data = await createInstance(sgName, keyName)
        console.log('Created instance with:', data)
    } catch (err) {
        console.error('Failed to create instance with:', err)
    }
}

// Create functions
async function createSecurityGroup(sgName) {
    const sgParams = {
        Description: sgName,
        GroupName: sgName,
    }
    const createCommand = new CreateSecurityGroupCommand(sgParams)
    const data = await sendCommand(createCommand)

    const rulesParams = {
        GroupId: data.GroupId,
        IpPermissions: [
            {
                IpProtocol: 'tcp',
                FromPort: 22,
                ToPort: 22,
                IpRanges: [{CidrIp: '119.17.170.35/32'}]
            },
            {
                IpProtocol: 'tcp',
                FromPort: 3000,
                ToPort: 3000,
                IpRanges: [{CidrIp: '119.17.170.35/32'}]
            },
        ]
    }
    const authCommand = new AuthorizeSecurityGroupIngressCommand(rulesParams)
    return sendCommand(authCommand)
}

async function createKeyPair(keyName) {
    const params = {
        KeyName: keyName
    }
    const command = new CreateKeyPairCommand(params)
    return sendCommand(command)
}

async function createInstance(sgName, keyName) {
    const params = {
        ImageId: 'ami-0c6120f461d6b39e9',
        InstanceType: 't2.micro',
        KeyName: keyName,
        MaxCount: 1,
        MinCount: 1,
        SecurityGroups: [sgName],
        UserData: 'IyEvYmluL2Jhc2gKc3UgZWMyLXVzZXIKY3VybCAtLXNpbGVudCAtLWxvY2F0aW9uIGh0dHBzOi8vcnBtLm5vZGVzb3VyY2UuY29tL3NldHVwXzE2LnggfCBzdWRvIGJhc2ggLQpzdWRvIHl1bSBpbnN0YWxsIC15IG5vZGVqcwpzdWRvIHl1bSBpbnN0YWxsIC15IGdpdAplY2hvICJucG0gaW5zdGFsbCB5YXJuIC1nIgpzdWRvIG5wbSBpbnN0YWxsIHlhcm4gLWcKZWNobyAiZW5kIG5wbSBpbnN0YWxsIHlhcm4gLWciCmNkIH4KZ2l0IGNsb25lIGh0dHBzOi8vZ2l0aHViLmNvbS9yeWFubXVyYWthbWkvaGJmbC5naXQKY2QgaGJmbAplY2hvICJ5YXJuIgp5YXJuCmVjaG8gImVuZCB5YXJuIgp5YXJuIHN0YXJ0',
    }
    const command = new RunInstancesCommand(params)
    return sendCommand(command)
}

execute()