// ❌ Vulnerable Code (Simulated)
function loginUser(username, password) {
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    return query;
}

// ✅ Secure Code (Simulated)
function loginUserSecure(username, password) {
    const query = "SELECT * FROM users WHERE username = ? AND password = ?";
    return {
        query: query,
        params: [username, password]
    };
}

// ✅ Toast Notification
function showToast(message, isWarning = false) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.backgroundColor = isWarning ? "#dc3545" : "#333"; // แดงถ้า SQLi
    toast.className = "show";

    setTimeout(() => {
        toast.className = toast.className.replace("show", "");
    }, 3000);
}

// ✅ ตรวจจับ SQL Injection
function detectSQLInjection(username, password) {
    const injectionPatterns = [
        " or ", " and ", "--", ";", "/*", "*/", "@@", "@", 
        "char", "nchar", "varchar", "nvarchar",
        "alter", "begin", "cast", "create", "cursor", "declare", "delete", "drop", 
        "end", "exec", "execute", "fetch", "insert", "kill", "open", "select", 
        "sys", "sysobjects", "syscolumns", "table", "update"
    ];
    const input = (username + " " + password).toLowerCase();
    return injectionPatterns.some(pattern => input.includes(pattern));
}

// ฟังก์ชันทดสอบ Vulnerable Query
function testVulnerable() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const query = loginUser(username, password);

    // ตรวจจับ SQL Injection
    if (detectSQLInjection(username, password)) {
        alert("⚠️ พบความพยายาม SQL Injection! Query นี้ไม่ปลอดภัย");
        showToast("⚠️ พบ SQL Injection Attempt!", true);
    }

    document.getElementById("query-output").innerHTML = 
        `<span class="danger">❌ Vulnerable Query:</span><br>${query}<br><br>
        ⚠️ หาก input เป็น <code>admin' OR '1'='1' --</code> 
        จะ bypass authentication ได้!`;
}

// ฟังก์ชันทดสอบ Secure Query
function testSecure() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const result = loginUserSecure(username, password);

    // ตรวจจับ SQL Injection
    if (detectSQLInjection(username, password)) {
        alert("✅ พบความพยายาม SQL Injection! แต่โค้ดนี้ป้องกันไว้แล้ว");
        showToast("✅ พบ SQL Injection แต่ปลอดภัย ", true);
    } else {
        showToast("✅ Query ปลอดภัย ไม่มี SQL Injection");
    }

    document.getElementById("query-output").innerHTML = 
        `<span class="success">✅ Secure Query:</span><br>${result.query}<br>
         <strong>Parameters:</strong> [ "${result.params[0]}", "${result.params[1]}" ]<br><br>
         ✔️ ป้องกัน SQL Injection ได้เพราะใช้ Parameterized Query`;
}
