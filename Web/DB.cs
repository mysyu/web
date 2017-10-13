using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace Web
{
    public class DB
    {
        private static String DBHost = "mysyu.ddns.net";
        private static String DBUser = "mysyu";
        private static String DBPassword = "mysyu";
        private static String DBName = "mysyu";
        private static String DBCharSet = "utf8";
        private static String DBTimeout = "1";
        private static MySqlConnection DBConnection = null;

        public DB()
        {
            Connect();
        }
        public DataTable Select(String command,Dictionary<String,Object>dic)
        {
            Connect();
            DataTable result = new DataTable();
            MySqlCommand cmd = new MySqlCommand(command, DBConnection);
            foreach (var key in dic.Keys)
                cmd.Parameters.AddWithValue(key, dic[key]);
            result.Load(cmd.ExecuteReader());
            DisConnect();
            return result;
        }
        public int ExecuteNonQuery(String command, Dictionary<String, Object> dic)
        {
            Connect();
            MySqlCommand cmd = new MySqlCommand(command, DBConnection);
            foreach (var key in dic.Keys)
                cmd.Parameters.AddWithValue(key, dic[key]);
            int result = cmd.ExecuteNonQuery();
            DisConnect();
            return result;
        }
        public Object ExecuteScalar(String command, Dictionary<String, Object> dic)
        {
            Connect();
            MySqlCommand cmd = new MySqlCommand(command, DBConnection);
            foreach (var key in dic.Keys)
                cmd.Parameters.AddWithValue(key, dic[key]);
            Object result = cmd.ExecuteScalar();
            DisConnect();
            return result;
        }
        public bool isConnect
        {
            get
            {
                return DBConnection != null;
            }
        }
        public void Connect()
        {
            if (!isConnect)
            {
                DBConnection = new MySqlConnection(String.Format("server={0};uid={1};pwd={2};database={3};charset={4};Connection Timeout={5}", DBHost, DBUser, DBPassword, DBName, DBCharSet, DBTimeout));
                DBConnection.Open();
            }
        }
        public void DisConnect()
        {
            if (isConnect)
            {
                DBConnection.Close();
                DBConnection = null;
            }
        }
    }
}