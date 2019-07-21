import React from 'react';
import { Button, Modal, InputNumber } from 'antd';
import { connect, createAction } from '../../utils/index';
import styles from './index.css';
import { Unit } from '@harmony-js/utils';

class Owner extends React.Component {
  state = {
    visible: false,
    confirmVisible: false,
    confirmLoading: false,
    inputValue: '',
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  showConfirmaModal = () => {
    this.setState({
      confirmVisible: true,
    });
  };

  handleOk = () => {
    this.props.deposit(this.state.inputValue);
    // this.props.getAccount({ privateKey: this.state.inputValue });
    this.setState({
      confirmLoading: true,
    });

    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
      this.props.getContractState();
    }, 2000);
  };

  handleConfirmOk = () => {
    this.props.pickWinner();
    this.setState({
      confirmConfirmLoading: true,
    });

    setTimeout(() => {
      this.setState({
        confirmVisible: false,
        confirmConfirmLoading: false,
      });
      this.props.getContractState();
    }, 2000);
  };

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
      inputValue: '',
    });
  };

  handleConfirmCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      confirmVisible: false,
    });
  };

  handleInput = value => {
    this.setState({ inputValue: value });
  };

  componentDidMount() {
    this.props.getPlayers();
    this.props.getAccountBalance();
  }

  displayAddress(address) {
    const dot = `...`;
    const start = address.substring(0, 8);
    const tail = address.substring(address.length - 4, address.length);
    return `${start}${dot}${tail}`;
  }

  render() {
    const contractAddress = this.props.contractAddress;
    const players = this.props.players;
    const displayContractBalance = new Unit(this.props.contractBalance).asWei().toEther();
    const displayBalance = new Unit(this.props.accountBalance).asWei().toEther();

    // const contractBalance = this.props.contractBalance;

    const { visible, confirmLoading, confirmConfirmLoading, confirmVisible } = this.state;

    if (this.props.emitter) {
      this.props.emitter
        .on('transactionHash', txHash => {
          console.log(txHash);
        })
        .on('receipt', receipt => {
          console.log(receipt);
        })
        .on('error', error => {
          console.log(error);
        })
        .on('confirmation', confirmation => {
          console.log(confirmation);
        });
    }

    return (
      <div className={styles.normal}>
        <ul style={{ margin: 0, padding: 0, width: '100%' }}>
          <li
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div style={{ fontSize: '1.2em', color: '#ffffff' }}>Game Address :</div>
            <div>
              <a
                href={`https://ropsten.etherscan.io/address/${contractAddress}`}
                className={styles.link}
              >
                {this.displayAddress(contractAddress)}
              </a>
            </div>
          </li>
          <li
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div style={{ fontSize: '1.2em', color: '#ffffff' }}>Players In game :</div>
            <div style={{ fontSize: '1.2em', color: '#ffffff' }}>{this.props.players.length}</div>
          </li>
          <li
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div style={{ fontSize: '1.2em', color: '#ffffff' }}>Current Game Balance :</div>
            <div
              style={{ fontSize: '1.2em', color: '#ffffff' }}
            >{`${displayContractBalance} ONE`}</div>
          </li>
        </ul>
        <div className={styles.title}>You are the owner</div>
        <div
          style={{
            fontSize: '1.2em',
            color: '#e4e710',
            marginBottom: '1em',
          }}
        >
          {`${displayBalance.substring(0, displayBalance.length - 12)} ONE`}
        </div>
        <div className={styles.buttonWrapper}>
          <Button
            size="large"
            type="primary"
            block
            style={{ height: '2.8em', fontSize: '1.6em' }}
            onClick={this.showModal}
          >
            Deposit
          </Button>
        </div>
        <div className={styles.buttonWrapper}>
          <Button
            size="large"
            type="danger"
            block
            style={{ height: '2.8em', fontSize: '1.6em', marginTop: '1.2em' }}
            onClick={this.showConfirmaModal}
            disabled={players.length === 0}
          >
            Pick Winner
          </Button>
        </div>
        <Modal
          title="Input Deposit Value (min:0.1 ONE)"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          centered
        >
          <InputNumber defaultValue="0.1" onChange={this.handleInput} style={{ width: '100%' }} />
        </Modal>

        <Modal
          title="Confirm To Pick Winner"
          visible={confirmVisible}
          onOk={this.handleConfirmOk}
          confirmLoading={confirmConfirmLoading}
          onCancel={this.handleConfirmCancel}
          centered
        >
          <p>Would you like to pick winner and end this round?</p>
        </Modal>
      </div>
    );
  }
}
//0xd111e251634b0af6316f863bba605efe8c11ac211a67d5783aabc66c850f04c5

function mapState(state) {
  return {
    contractAddress: state.contract.contractAddress,
    contractBalance: state.contract.contractBalance,
    players: state.contract.players,
    account: state.account.account,
    accountBalance: state.account.accountBalance,
    manager: state.account.manager,
    error: state.account.error,
    emitter: state.contract.emitter,
  };
}

function mapDispatch(dispatch) {
  return {
    getAccount: key => dispatch(createAction('account/getAccount')(key)),
    getContractState: () => dispatch(createAction('contract/getContractState')()),
    getPlayers: () => dispatch(createAction('contract/getPlayers')()),
    getAccountBalance: () => dispatch(createAction('account/getAccountBalance')()),
    deposit: payload => dispatch(createAction('contract/deposit')(payload)),
    pickWinner: () => dispatch(createAction('contract/pickWinner')()),
  };
}

export default connect(
  mapState,
  mapDispatch,
)(Owner);