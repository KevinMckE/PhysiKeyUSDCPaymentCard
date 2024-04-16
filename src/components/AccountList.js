import * as React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { List, Card } from 'react-native-paper';

const AccountList = ({ }) => {
    return (

        <ScrollView style={styles.container}>
            <List.Section>

                <Card style={styles.card}>
                    <List.Item title="First Item" left={() => <List.Icon icon="folder" />} />
                </Card>
                <Card style={styles.card}>
                    <List.Item title="First Item" left={() => <List.Icon icon="folder" />} />
                </Card>
                <Card style={styles.card}>
                    <List.Item title="First Item" left={() => <List.Icon icon="folder" />} />
                </Card>
                <Card style={styles.card}>
                    <List.Item title="First Item" left={() => <List.Icon icon="folder" />} />
                </Card>
                <Card style={styles.card}>
                    <List.Item title="First Item" left={() => <List.Icon icon="folder" />} />
                </Card>
                <Card style={styles.card}>
                    <List.Item title="First Item" left={() => <List.Icon icon="folder" />} />
                </Card>
                <Card style={styles.card}>
                    <List.Item title="First Item" left={() => <List.Icon icon="folder" />} />
                </Card>
                <Card style={styles.card}>
                    <List.Item title="First Item" left={() => <List.Icon icon="folder" />} />
                </Card>
                <Card style={styles.card}>
                    <List.Item title="First Item" left={() => <List.Icon icon="folder" />} />
                </Card>
            </List.Section>
        </ScrollView>

    );
};

export default AccountList;

const styles = StyleSheet.create({
    container: {
        padding: 5,
        width: '100%',
    },
    card: {
        margin: 10,
        backgroundColor: '#ffffff',
    },
});

