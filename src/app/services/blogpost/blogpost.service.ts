import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { IPost } from '../../models/post';
import { IComment } from '../../models/comment';

@Injectable({
  providedIn: 'root'
})
export class BlogpostService {
  constructor(private firestore: Firestore) {}

  private convertTimestamps<T extends { createdAt?: any; updatedAt?: any }>(item: T): T {
    return {
      ...item,
      createdAt: item.createdAt instanceof Timestamp ? item.createdAt.toDate() : item.createdAt,
      updatedAt: item.updatedAt instanceof Timestamp ? item.updatedAt.toDate() : item.updatedAt
    };
  }

  getPosts(): Observable<IPost[]> {
    const postsCollection = collection(this.firestore, 'posts');
    return collectionData(postsCollection, { idField: 'id' }).pipe(
      map(posts => posts.map(post => this.convertTimestamps(post as IPost)))
    ) as Observable<IPost[]>;
  }

  getPost(id: string): Observable<IPost | undefined> {
    const postDoc = doc(this.firestore, `posts/${id}`);
    return docData(postDoc, { idField: 'id' }).pipe(
      map(post => post ? this.convertTimestamps(post as IPost) : undefined)
    ) as Observable<IPost | undefined>;
  }

  addPost(post: Omit<IPost, 'id' | 'createdAt' | 'updatedAt'>): Observable<string> {
    const postsCollection = collection(this.firestore, 'posts');
    const newPost = {
      ...post,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    return from(addDoc(postsCollection, newPost)).pipe(
      map(docRef => docRef.id)
    );
  }

  updatePost(id: string, post: Partial<Omit<IPost, 'id' | 'createdAt' | 'updatedAt'>>): Observable<void> {
    const postDoc = doc(this.firestore, `posts/${id}`);
    const updatedPost = {
      ...post,
      updatedAt: Timestamp.now()
    };
    return from(updateDoc(postDoc, updatedPost));
  }

  deletePost(id: string): Observable<void> {
    const postDoc = doc(this.firestore, `posts/${id}`);
    return from(deleteDoc(postDoc));
  }

  getCommentsForPost(postId: string): Observable<IComment[]> {
    const commentsCollection = collection(this.firestore, 'comments');
    const commentsQuery = query(commentsCollection, 
      where('postId', '==', postId),
      orderBy('createdAt', 'desc')
    );
    return collectionData(commentsQuery, { idField: 'id' }).pipe(
      map(comments => comments.map(comment => this.convertTimestamps(comment as IComment)))
    ) as Observable<IComment[]>;
  }

  getAllComments(): Observable<IComment[]> {
    const commentsCollection = collection(this.firestore, 'comments');
    return collectionData(commentsCollection, { idField: 'id' }).pipe(
      map(comments => comments.map(comment => this.convertTimestamps(comment as IComment)))
    ) as Observable<IComment[]>;
  }

  addComment(comment: Omit<IComment, 'id' | 'createdAt' | 'updatedAt'>): Observable<string> {
    const commentsCollection = collection(this.firestore, 'comments');
    const newComment = {
      ...comment,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    return from(addDoc(commentsCollection, newComment)).pipe(
      map(docRef => docRef.id)
    );
  }

  updateComment(id: string, comment: Partial<Omit<IComment, 'id' | 'createdAt' | 'updatedAt'>>): Observable<void> {
    const commentDoc = doc(this.firestore, `comments/${id}`);
    const updatedComment = {
      ...comment,
      updatedAt: Timestamp.now()
    };
    return from(updateDoc(commentDoc, updatedComment));
  }

  deleteComment(id: string): Observable<void> {
    const commentDoc = doc(this.firestore, `comments/${id}`);
    return from(deleteDoc(commentDoc));
  }
}