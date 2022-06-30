#!/bin/bash
su ec2-user
curl --silent --location https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs
sudo yum install -y git
echo "npm install yarn -g"
sudo npm install yarn -g
echo "end npm install yarn -g"
cd ~
git clone https://github.com/ryanmurakami/hbfl.git
cd hbfl
echo "yarn"
yarn
echo "end yarn"
yarn start

# The above commands base64 encoded for entering into UserData
# IyEvYmluL2Jhc2gKc3UgZWMyLXVzZXIKY3VybCAtLXNpbGVudCAtLWxvY2F0aW9uIGh0dHBzOi8vcnBtLm5vZGVzb3VyY2UuY29tL3NldHVwXzE2LnggfCBzdWRvIGJhc2ggLQpzdWRvIHl1bSBpbnN0YWxsIC15IG5vZGVqcwpzdWRvIHl1bSBpbnN0YWxsIC15IGdpdAplY2hvICJucG0gaW5zdGFsbCB5YXJuIC1nIgpzdWRvIG5wbSBpbnN0YWxsIHlhcm4gLWcKZWNobyAiZW5kIG5wbSBpbnN0YWxsIHlhcm4gLWciCmNkIH4KZ2l0IGNsb25lIGh0dHBzOi8vZ2l0aHViLmNvbS9yeWFubXVyYWthbWkvaGJmbC5naXQKY2QgaGJmbAplY2hvICJ5YXJuIgp5YXJuCmVjaG8gImVuZCB5YXJuIgp5YXJuIHN0YXJ0