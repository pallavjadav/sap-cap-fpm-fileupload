service OutboxTestService {

    action simulateRemoteCall(fileName: String,
                              recordCount: Integer);

    action longRunningProcess(fileName: String,
                              recordCount: Integer);

}
