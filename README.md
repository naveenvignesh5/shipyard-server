## SHIPYARD SERVER

**Note:**

#### **Environment Setup**

##### For Windows

* Install [node.js](https://nodejs.org/en/) LTS for windows.
* Install [GIT](https://git-scm.com/download/win) for windows.

##### For Ubuntu

* Install node.js by following this [guide](https://websiteforstudents.com/install-the-latest-node-js-and-nmp-packages-on-ubuntu-16-04-18-04-lts/)

* Install git by the following command.

```shell
sudo apt-get install git -y
```

#### **Setting up Repository**

Fork this repo to your account and clone the repo to local machine.

```shell
git clone https://github.com/naveenvignesh5/shipyard-server.git
```

#### **Setting up MySQL Database**
Start your MySQL server

*Note:* If you have password for myql with different username update it in `config/config.json`

Run the command in GIT BASH in case of windows within product directory.

*DB Migration*

```shell
./node_modules/.bin/sequelize db:create
./node_modules/.bin/sequelize db:migrate
./node_modules/.bin/sequelize db:drop # Use it drop the database
```

#### **Setting up Environment Keys**

```shell
cp .env.template .env # unix bash
copy .env.template .env # windows cmd
```

Add API keys from **Twilio**, **SendGrid**, **OneSignal**, and **Convert API**.

#### **Running the server**

```shell
cd shipyard-server
npm install # use only npm and not yarn
npm run start # start the server
```

Server will be listening on http://localhost:5000