const pool = require("../database")

/* ***********************
 *  Log Activity
 * *********************** */
async function logActivity(account_id, activity_type) {
  try {
    const sql = `
      INSERT INTO account_activity (account_id, activity_type)
      VALUES ($1, $2)
    `
    return await pool.query(sql, [account_id, activity_type])
  } catch (error) {
    console.error("logActivity error:", error)
  }
}

/* ***********************
 *  Get Activity by Account ID
 * *********************** */
async function getActivityByAccountId(account_id) {
  try {
    const sql = `
      SELECT activity_type, activity_date
      FROM account_activity
      WHERE account_id = $1
      ORDER BY activity_date DESC
      LIMIT 10
    `
    const data = await pool.query(sql, [account_id])
    return data.rows
  } catch (error) {
    console.error("getActivityByAccountId error:", error)
  }
}


async function getActivityByType(account_id, activity_type) {
    try {
      const sql = `
        SELECT activity_type, activity_date
        FROM account_activity
        WHERE account_id = $1 AND activity_type = $2
        ORDER BY activity_date DESC
      `
      const data = await pool.query(sql, [account_id, activity_type])
      return data.rows
    } catch (error) {
      console.error("getActivityByType error:", error)
      return []
    }
  }
  


module.exports = {
  logActivity,
  getActivityByAccountId,
  getActivityByType
}
