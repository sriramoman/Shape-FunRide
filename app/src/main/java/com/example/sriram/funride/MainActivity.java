package com.example.sriram.funride;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends AppCompatActivity {

    ListView list;
//    String[] itemname ={
//            "Safari",
//            "Camera",
//            "Global",
//            "FireFox",
//            "UC Browser",
//            "Android Folder",
//            "VLC Player",
//            "Cold War"
//    };

//    String[] descrname ={
//            "description Safari",
//            "description Camera",
//            "description Global",
//            "description FireFox",
//            "description UC Browser",
//            "description Android Folder",
//            "description VLC Player",
//            "description Cold War"
//    };
//    Integer[] imgid={
//            R.drawable.brianhardy,
//            R.drawable.brianhardy,
//            R.drawable.brianhardy,
//            R.drawable.brianhardy,
//            R.drawable.brianhardy,
//            R.drawable.brianhardy,
//            R.drawable.brianhardy,
//            R.drawable.brianhardy,
//    };

    List itemname = new ArrayList<String>();
    List descrname = new ArrayList<String>();
    List imgid = new ArrayList<String>();
    List urlname = new ArrayList<String>();

    public String loadJSONFromAsset() {
        String json = new String("Hey");
        try {

            InputStream is = getApplicationContext().getResources().openRawResource(R.raw.metadata);

            int size = is.available();

            byte[] buffer = new byte[size];

            is.read(buffer);

            is.close();

            json = new String(buffer, "UTF-8");


        } catch (IOException ex) {
            ex.printStackTrace();
            return null;
        }
        return json;

    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        String urlStart = "http://10.10.60.68/videos/";

        try {
            String jsonString = loadJSONFromAsset();
            JSONObject jsonRootObject = new JSONObject(jsonString);
            JSONArray jsonArray = jsonRootObject.optJSONArray("updates");
            int numVids = jsonArray.length()<6?jsonArray.length():6;
            //Iterate the jsonArray and print the info of JSONObjects
            for(int i=0; i < numVids; i++){
                JSONObject jsonObject = jsonArray.getJSONObject(i);

                String iname = jsonObject.optString("title").toString();
                itemname.add(iname);
                String dname = jsonObject.optString("description").toString();
                descrname.add(iname);
                String url = jsonObject.optString("url").toString();
                urlname.add(urlStart+url+".mp4");
                imgid.add(urlStart+url+".JPG");
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
        CustomListAdapter adapter=new CustomListAdapter(this, itemname,descrname, imgid);
        list=(ListView)findViewById(R.id.list);
        list.setAdapter(adapter);

        final Intent i = new Intent(this,Video.class);
        list.setOnItemClickListener(new AdapterView.OnItemClickListener() {

            @Override
            public void onItemClick(AdapterView<?> parent, View view,
                                    int position, long id) {
                // TODO Auto-generated method stub
                String Slecteditem= (String)urlname.get(position);
                //Create the bundle
                Bundle bundle = new Bundle();

                //Add your data to bundle
                bundle.putString("url", Slecteditem);

                //Add the bundle to the intent
                i.putExtras(bundle);
                startActivity(i);
            }
        });
    }
}
