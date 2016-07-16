package com.example.sriram.funride;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.StrictMode;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;

/**
 * Created by sriram on 7/16/16.
 */
public class CustomListAdapter extends ArrayAdapter<String> {

    private final Activity context;
    private final List itemname;
    private final List descname;
    private final List imgid;

    public CustomListAdapter(Activity context, List itemname, List descname, List imgid) {
        super(context, R.layout.mylist, itemname);
        // TODO Auto-generated constructor stub

        this.context=context;
        this.itemname=itemname;
        this.imgid=imgid;
        this.descname=descname;
    }



    public View getView(int position, View view, ViewGroup parent) {
        LayoutInflater inflater=context.getLayoutInflater();
        View rowView=inflater.inflate(R.layout.mylist, null,true);

        TextView txtTitle = (TextView) rowView.findViewById(R.id.item);


        ImageView imageView = (ImageView) rowView.findViewById(R.id.icon);
        URL newurl = null;
        Bitmap mIcon_val=null;
        try {
            newurl = new URL((String)this.imgid.get(position));
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
        try {
            StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();

            StrictMode.setThreadPolicy(policy);
            mIcon_val = BitmapFactory.decodeStream(newurl.openConnection().getInputStream());
        } catch (IOException e) {
            e.printStackTrace();
        }
        imageView.setImageBitmap(mIcon_val);

        TextView extratxt = (TextView) rowView.findViewById(R.id.textView1);

        txtTitle.setText((String)itemname.get(position));
//        imageView.setImageResource((int)imgid.get(position));
        extratxt.setText((String)descname.get(position));
        return rowView;

    };
}
